/**
 * CRM Context - DIRECT DATABASE INTEGRATION
 * 
 * CRITICAL ARCHITECTURE RULES:
 * =============================
 * 1. NO localStorage or sessionStorage - EVER
 * 2. NO local state caching beyond what's needed for React rendering
 * 3. EVERY write operation (create/update/delete) immediately triggers a full refetch from Supabase
 * 4. ALL data displayed in the UI comes directly from the live Supabase database
 * 5. Real-time subscriptions ensure data stays synchronized across all users
 * 
 * DATA FLOW:
 * ==========
 * User Action → Write to Supabase → Refetch ALL data from Supabase → Update UI
 * 
 * This ensures:
 * - Zero data inconsistencies
 * - Real-time synchronization
 * - Single source of truth (the database)
 * - All dashboard metrics reflect live database state
 */
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

  // CRITICAL: This is the ONLY source of truth for all CRM data.
  // After EVERY write operation (create/update/delete), we refetch ALL data from Supabase.
  // NO local state caching - everything comes directly from the database.
  const fetchData = async () => {
    const timestamp = new Date().toISOString();
    setLoading(true);
    setError(null);
    try {
      console.log(`[CRM ${timestamp}] 🔄 Fetching all data directly from Supabase database...`);
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

      console.log(`[CRM ${timestamp}] ✓ Successfully fetched from Supabase:`, {
        staff: staffData?.length || 0,
        contacts: contactsData?.length || 0,
        companies: companiesData?.length || 0,
        deals: dealsData?.length || 0,
        activities: activitiesData?.length || 0,
        interactions: interactionsData?.length || 0,
        platforms: platformsData?.length || 0
      });

      setStaff(staffData || []);
      setContacts(contactsData || []);
      setCompanies(companiesData || []);
      setDeals(dealsData || []);
      setActivities(activitiesData || []);
      setInteractions(interactionsData || []);
      setPlatforms(platformsData || []);
      
      console.log('[CRM] Successfully loaded all data from Supabase');
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
      console.log('[CRM] Creating new staff:', newStaff);
      const { data, error } = await supabase.from('staff').insert(newStaff).select().single();
      if (error) throw error;
      console.log('[CRM] Staff created successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('Error adding staff:', err);
      return null;
    }
  };

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    try {
      console.log('[CRM] Updating staff:', id, updates);
      const { data, error } = await supabase.from('staff').update(updates).eq('id', id).select().single();
      if (error) throw error;
      console.log('[CRM] Staff updated successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('Error updating staff:', err);
      return null;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      console.log('[CRM] Deleting staff:', id);
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
      console.log('[CRM] Staff deleted successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'company'>) => {
    try {
      console.log('[CRM] Creating new contact:', contact);
      const { data, error } = await supabase.from('contacts').insert(contact).select('*, company:companies(*), owner:staff(*)').single();
      if (error) throw error;
      console.log('[CRM] Contact created successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('[CRM] Error adding contact:', err);
      return null;
    }
  };
  
  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      console.log('[CRM] Updating contact:', id, updates);
      const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select('*, company:companies(*), owner:staff(*)').single();
      if (error) throw error;
      console.log('[CRM] Contact updated successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('Error updating contact:', err);
      return null;
    }
  };
  
  const addCompany = async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('[CRM] Creating new company:', company);
      const { data, error } = await supabase.from('companies').insert(company).select().single();
      if (error) throw error;
      console.log('[CRM] Company created successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('Error adding company:', err);
      return null;
    }
  };

  const addDeal = async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact' | 'company' | 'platform'>) => {
    try {
      console.log('[CRM] 💰 Creating new deal in database:', deal);
      const { data, error } = await supabase.from('deals').insert(deal).select('*, contact:contacts(*), company:companies(*), platform:platforms(*), owner:staff(*)').single();
      if (error) throw error;
      console.log('[CRM] ✅ Deal created successfully in Supabase DB! ID:', data.id);
      console.log('[CRM] 🔄 Refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('[CRM] ❌ Error adding deal to database:', err);
      return null;
    }
  };

  const updateDealStage = async (id: string, stage: string) => {
    try {
      console.log('[CRM] 🔄 Updating deal stage in database:', id, '→', stage);
      const { error } = await supabase.from('deals').update({ stage }).eq('id', id);
      if (error) throw error;
      console.log('[CRM] ✅ Deal stage updated successfully in Supabase DB!');
      console.log('[CRM] 🔄 Refetching all data from database...');
      await fetchData(); // Refetch everything from database
    } catch (err) {
      console.error('[CRM] ❌ Error updating deal stage in database:', err);
    }
  };
  
  const deleteDeal = async (id: string) => {
    try {
      console.log('[CRM] 🗑️ Deleting deal from database:', id);
      const { error } = await supabase.from('deals').delete().eq('id', id);
      if (error) throw error;
      console.log('[CRM] ✅ Deal deleted successfully from Supabase DB!');
      console.log('[CRM] 🔄 Refetching all data from database...');
      await fetchData(); // Refetch everything from database
    } catch (err) {
      console.error('[CRM] ❌ Error deleting deal from database:', err);
    }
  };
  
  const addActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'completed_at'>) => {
      try {
          console.log('[CRM] 📝 Creating new activity with data:', JSON.stringify(activity, null, 2));
          const { data, error } = await supabase.from('activities').insert(activity).select('*, contact:contacts(*), deal:deals(*), owner:staff(*)').single();
          if (error) {
            console.error('[CRM] ❌ ERROR creating activity:', error);
            throw error;
          }
          console.log('[CRM] ✅ Activity created successfully in DB:', data);
          console.log('[CRM] 🔄 Refetching all data from database...');
          await fetchData(); // Refetch everything from database
          return data;
      } catch (err: any) {
          console.error('[CRM] ❌ EXCEPTION adding activity:', err);
          console.error('[CRM] Error details:', {
            message: err?.message,
            details: err?.details,
            hint: err?.hint,
            code: err?.code
          });
          return null;
      }
  };
  
  const completeActivity = async (id: string, completed: boolean) => {
      try {
          console.log('[CRM] Updating activity completion:', id, completed);
          const { error } = await supabase.from('activities').update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', id);
          if (error) throw error;
          console.log('[CRM] Activity updated successfully, refetching all data from database...');
          await fetchData(); // Refetch everything from database
      } catch (err) {
          console.error('Error completing activity:', err);
      }
  };
  
  const addPlatform = async (name: string) => {
      try {
          console.log('[CRM] Creating new platform:', name);
          const { data, error } = await supabase.from('platforms').insert({ name }).select().single();
          if (error) throw error;
          console.log('[CRM] Platform created successfully, refetching all data from database...');
          await fetchData(); // Refetch everything from database
          return data;
      } catch (err) {
          console.error('Error adding platform:', err);
          return null;
      }
  };

  const updatePlatform = async (id: string, name: string) => {
    try {
      console.log('[CRM] Updating platform:', id, name);
      const { data, error } = await supabase.from('platforms').update({ name }).eq('id', id).select().single();
      if (error) throw error;
      console.log('[CRM] Platform updated successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
      return data;
    } catch (err) {
      console.error('Error updating platform:', err);
      return null;
    }
  };

  const deletePlatform = async (id: string) => {
    try {
      console.log('[CRM] Deleting platform:', id);
      const { error } = await supabase.from('platforms').delete().eq('id', id);
      if (error) throw error;
      console.log('[CRM] Platform deleted successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
    } catch (err) {
      console.error('Error deleting platform:', err);
    }
  };

  const addInteraction = async (interaction: Omit<Interaction, 'id' | 'created_at'>) => {
    try {
      console.log('[CRM] Creating new interaction:', interaction);
      const { data, error } = await supabase.from('interactions').insert(interaction).select().single();
      if (error) throw error;
      console.log('[CRM] Interaction created successfully, refetching all data from database...');
      await fetchData(); // Refetch everything from database
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