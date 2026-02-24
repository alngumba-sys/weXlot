import { supabase } from './supabase';
import { Staff, Contact, Company, Deal, Activity, Interaction, Platform } from '../types/crm';

/*
  REQUIRED SUPABASE TABLES SQL:

  -- Enable UUID extension
  create extension if not exists "uuid-ossp";

  -- Staff table
  create table if not exists staff (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text unique not null,
    role text check (role in ('admin', 'staff')) default 'staff',
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Companies
  create table if not exists companies (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    industry text,
    size text,
    website text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Contacts
  create table if not exists contacts (
    id uuid primary key default uuid_generate_v4(),
    first_name text not null,
    last_name text not null,
    email text,
    phone text,
    job_title text,
    company_id uuid references companies(id),
    main_need text,
    budget_range text,
    decision_authority text,
    notes text,
    owner_id uuid references staff(id),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Platforms
  create table if not exists platforms (
    id uuid primary key default uuid_generate_v4(),
    name text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Deals
  create table if not exists deals (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    value numeric default 0,
    stage text not null,
    probability integer default 50,
    expected_close_date date,
    contact_id uuid references contacts(id),
    company_id uuid references companies(id),
    platform_id uuid references platforms(id),
    owner_id uuid references staff(id),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Activities (Tasks/Reminders)
  create table if not exists activities (
    id uuid primary key default uuid_generate_v4(),
    type text not null,
    description text not null,
    due_date timestamp with time zone,
    completed boolean default false,
    completed_at timestamp with time zone,
    contact_id uuid references contacts(id),
    deal_id uuid references deals(id),
    owner_id uuid references staff(id),
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

  -- Interactions (History log)
  create table if not exists interactions (
    id uuid primary key default uuid_generate_v4(),
    type text not null,
    notes text,
    date timestamp with time zone default timezone('utc'::text, now()),
    contact_id uuid references contacts(id),
    deal_id uuid references deals(id),
    created_at timestamp with time zone default timezone('utc'::text, now())
  );

*/

export const CRM_API = {
  // Staff
  getStaff: async () => {
    const { data, error } = await supabase.from('staff').select('*');
    if (error) throw error;
    return data as Staff[];
  },
  addStaff: async (staff: Omit<Staff, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('staff').insert(staff).select().single();
    if (error) throw error;
    return data as Staff;
  },
  updateStaff: async (id: string, updates: Partial<Staff>) => {
    const { data, error } = await supabase.from('staff').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Staff;
  },
  deleteStaff: async (id: string) => {
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error) throw error;
  },

  // Companies
  getCompanies: async () => {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) throw error;
    return data as Company[];
  },
  addCompany: async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase.from('companies').insert(company).select().single();
    if (error) throw error;
    return data as Company;
  },

  // Contacts
  getContacts: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        company:companies(*)
      `);
    if (error) throw error;
    return data as Contact[];
  },
  addContact: async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'company'>) => {
    const { data, error } = await supabase.from('contacts').insert(contact).select().single();
    if (error) throw error;
    return data as Contact;
  },
  updateContact: async (id: string, updates: Partial<Contact>) => {
    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Contact;
  },

  // Platforms
  getPlatforms: async () => {
    const { data, error } = await supabase.from('platforms').select('*');
    if (error) throw error;
    return data as Platform[];
  },
  addPlatform: async (name: string) => {
    const { data, error } = await supabase.from('platforms').insert({ name }).select().single();
    if (error) throw error;
    return data as Platform;
  },
  updatePlatform: async (id: string, name: string) => {
    const { data, error } = await supabase.from('platforms').update({ name }).eq('id', id).select().single();
    if (error) throw error;
    return data as Platform;
  },
  deletePlatform: async (id: string) => {
    const { error } = await supabase.from('platforms').delete().eq('id', id);
    if (error) throw error;
  },

  // Deals
  getDeals: async () => {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        contact:contacts(*),
        company:companies(*),
        platform:platforms(*)
      `);
    if (error) throw error;
    return data as Deal[];
  },
  addDeal: async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact' | 'company' | 'platform'>) => {
    const { data, error } = await supabase.from('deals').insert(deal).select().single();
    if (error) throw error;
    return data as Deal;
  },
  updateDeal: async (id: string, updates: Partial<Deal>) => {
    const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Deal;
  },
  updateDealStage: async (id: string, stage: string) => {
      const { data, error } = await supabase.from('deals').update({ stage }).eq('id', id).select().single();
      if (error) throw error;
      return data as Deal;
  },

  // Activities
  getActivities: async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('due_date', { ascending: true });
    if (error) throw error;
    return data as Activity[];
  },
  addActivity: async (activity: Omit<Activity, 'id' | 'created_at' | 'completed_at'>) => {
    const { data, error } = await supabase.from('activities').insert(activity).select().single();
    if (error) throw error;
    return data as Activity;
  },
  completeActivity: async (id: string, completed: boolean) => {
    const { data, error } = await supabase
      .from('activities')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Activity;
  },

  // Interactions (Timeline)
  getInteractions: async (contactId?: string, dealId?: string) => {
    let query = supabase.from('interactions').select('*').order('date', { ascending: false });
    
    if (contactId) query = query.eq('contact_id', contactId);
    if (dealId) query = query.eq('deal_id', dealId);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Interaction[];
  },
  addInteraction: async (interaction: Omit<Interaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('interactions').insert(interaction).select().single();
    if (error) throw error;
    return data as Interaction;
  },
  
  // Dashboard Stats
  getDashboardStats: async () => {
      // This logic should ideally be done on backend or with specific queries, 
      // but for "lightweight" we can fetch deals and aggregate.
      // Or we can use .select('value, probability', { count: 'exact' }) etc.
      return {}; // Implemented in component via useMemo/useEffect on deals/activities data
  }
};
