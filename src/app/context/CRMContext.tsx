import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Staff, Contact, Company, Deal, Activity, Interaction, Platform } from '../../types/crm';
import { supabase } from '../../lib/supabase';

interface CRMContextType {
  staff: Staff[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  activities: Activity[];
  interactions: Interaction[];
  platforms: Platform[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  
  // Actions
  addStaff: (staff: Omit<Staff, 'id' | 'created_at'>) => Promise<Staff | null>;
  updateStaff: (id: string, updates: Partial<Staff>) => Promise<Staff | null>;
  deleteStaff: (id: string) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'company'>) => Promise<Contact | null>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact | null>;
  addCompany: (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => Promise<Company | null>;
  addDeal: (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact' | 'company' | 'platform'>) => Promise<Deal | null>;
  updateDealStage: (id: string, stage: string) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'completed_at'>) => Promise<Activity | null>;
  completeActivity: (id: string, completed: boolean) => Promise<void>;
  addPlatform: (name: string) => Promise<Platform | null>;
  updatePlatform: (id: string, name: string) => Promise<Platform | null>;
  deletePlatform: (id: string) => Promise<void>;
  addInteraction: (interaction: Omit<Interaction, 'id' | 'created_at'>) => Promise<Interaction | null>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch for speed
      const [
        { data: staffData },
        { data: contactsData },
        { data: companiesData },
        { data: dealsData },
        { data: activitiesData },
        { data: interactionsData },
        { data: platformsData }
      ] = await Promise.all([
        supabase.from('staff').select('*'),
        supabase.from('contacts').select('*, company:companies(*), owner:staff(*)'),
        supabase.from('companies').select('*'),
        supabase.from('deals').select('*, contact:contacts(*), company:companies(*), platform:platforms(*), owner:staff(*)'),
        supabase.from('activities').select('*, contact:contacts(*), deal:deals(*), owner:staff(*)').order('due_date', { ascending: true }),
        supabase.from('interactions').select('*').order('date', { ascending: false }),
        supabase.from('platforms').select('*')
      ]);

      setStaff(staffData || []);
      setContacts(contactsData || []);
      setCompanies(companiesData || []);
      setDeals(dealsData || []);
      setActivities(activitiesData || []);
      setInteractions(interactionsData || []);
      setPlatforms(platformsData || []);
    } catch (err: any) {
      console.error('Error fetching CRM data:', err);
      // Don't set global error if it's just missing tables (which might happen on first run)
      if (err.message?.includes('relation') && err.message?.includes('does not exist')) {
        setError('Database tables not found. Please run the migration script.');
      } else {
        setError(err.message || 'Failed to load CRM data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions for all tables to ensure data stays in sync
    const staffSubscription = supabase
      .channel('staff-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, () => {
        console.log('Staff data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    const contactsSubscription = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, () => {
        console.log('Contacts data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    const dealsSubscription = supabase
      .channel('deals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, () => {
        console.log('Deals data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    const activitiesSubscription = supabase
      .channel('activities-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
        console.log('Activities data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    const platformsSubscription = supabase
      .channel('platforms-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platforms' }, () => {
        console.log('Platforms data changed, refreshing...');
        fetchData();
      })
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      staffSubscription.unsubscribe();
      contactsSubscription.unsubscribe();
      dealsSubscription.unsubscribe();
      activitiesSubscription.unsubscribe();
      platformsSubscription.unsubscribe();
    };
  }, []);

  const addStaff = async (newStaff: Omit<Staff, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase.from('staff').insert(newStaff).select().single();
      if (error) throw error;
      setStaff(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding staff:', err);
      return null;
    }
  };

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    try {
      const { data, error } = await supabase.from('staff').update(updates).eq('id', id).select().single();
      if (error) throw error;
      setStaff(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      console.error('Error updating staff:', err);
      return null;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'company'>) => {
    try {
      const { data, error } = await supabase.from('contacts').insert(contact).select('*, company:companies(*), owner:staff(*)').single();
      if (error) throw error;
      setContacts(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding contact:', err);
      return null;
    }
  };
  
  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select('*, company:companies(*), owner:staff(*)').single();
      if (error) throw error;
      setContacts(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      console.error('Error updating contact:', err);
      return null;
    }
  };
  
  const addCompany = async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase.from('companies').insert(company).select().single();
      if (error) throw error;
      setCompanies(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding company:', err);
      return null;
    }
  };

  const addDeal = async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact' | 'company' | 'platform'>) => {
    try {
      const { data, error } = await supabase.from('deals').insert(deal).select('*, contact:contacts(*), company:companies(*), platform:platforms(*), owner:staff(*)').single();
      if (error) throw error;
      setDeals(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding deal:', err);
      return null;
    }
  };

  const updateDealStage = async (id: string, stage: string) => {
    try {
      const { error } = await supabase.from('deals').update({ stage }).eq('id', id);
      if (error) throw error;
      setDeals(prev => prev.map(d => d.id === id ? { ...d, stage: stage as any } : d));
    } catch (err) {
      console.error('Error updating deal stage:', err);
    }
  };
  
  const deleteDeal = async (id: string) => {
    try {
      const { error } = await supabase.from('deals').delete().eq('id', id);
      if (error) throw error;
      setDeals(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting deal:', err);
    }
  };
  
  const addActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'completed_at'>) => {
      try {
          const { data, error } = await supabase.from('activities').insert(activity).select('*, contact:contacts(*), deal:deals(*), owner:staff(*)').single();
          if (error) throw error;
          setActivities(prev => [...prev, data]);
          return data;
      } catch (err) {
          console.error('Error adding activity:', err);
          return null;
      }
  };
  
  const completeActivity = async (id: string, completed: boolean) => {
      try {
          const { error } = await supabase.from('activities').update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', id);
          if (error) throw error;
          setActivities(prev => prev.map(a => a.id === id ? { ...a, completed, completed_at: completed ? new Date().toISOString() : null } : a));
      } catch (err) {
          console.error('Error completing activity:', err);
      }
  };
  
  const addPlatform = async (name: string) => {
      try {
          const { data, error } = await supabase.from('platforms').insert({ name }).select().single();
          if (error) throw error;
          setPlatforms(prev => [...prev, data]);
          return data;
      } catch (err) {
          console.error('Error adding platform:', err);
          return null;
      }
  };

  const updatePlatform = async (id: string, name: string) => {
    try {
      const { data, error } = await supabase.from('platforms').update({ name }).eq('id', id).select().single();
      if (error) throw error;
      setPlatforms(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      console.error('Error updating platform:', err);
      return null;
    }
  };

  const deletePlatform = async (id: string) => {
    try {
      const { error } = await supabase.from('platforms').delete().eq('id', id);
      if (error) throw error;
      setPlatforms(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting platform:', err);
    }
  };

  const addInteraction = async (interaction: Omit<Interaction, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase.from('interactions').insert(interaction).select().single();
      if (error) throw error;
      setInteractions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding interaction:', err);
      return null;
    }
  };

  return (
    <CRMContext.Provider value={{
      staff,
      contacts,
      companies,
      deals,
      activities,
      interactions,
      platforms,
      loading,
      error,
      refreshData: fetchData,
      addStaff,
      updateStaff,
      deleteStaff,
      addContact,
      updateContact,
      addCompany,
      addDeal,
      updateDealStage,
      deleteDeal,
      addActivity,
      completeActivity,
      addPlatform,
      updatePlatform,
      deletePlatform,
      addInteraction
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}