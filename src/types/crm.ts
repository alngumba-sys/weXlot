export type UserRole = 'admin' | 'staff';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  job_title?: string;
  company_id?: string;
  company?: Company;
  company_name?: string; // Simple text field for business name
  location?: string; // Added location field
  main_need?: string; // Custom field
  budget_range?: string; // Custom field
  decision_authority?: string; // Custom field
  notes?: string;
  owner_id?: string; // Link to Staff
  created_at: string;
  updated_at: string;
}

export interface Platform {
  id: string;
  name: string;
  created_at: string;
}

export type DealStage = 'planned-visit' | 'first-contact' | 'decision-maker' | 'demo' | 'decision' | 'closed-won' | 'closed-lost';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number; // 0-100
  expected_close_date?: string;
  contact_id?: string;
  contact?: Contact; // Join
  company_id?: string;
  company?: Company; // Join
  platform_id?: string;
  platform?: Platform; // Join
  owner_id?: string;
  owner?: Staff;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  due_date?: string; // For future tasks
  completed_at?: string; // If done
  completed: boolean;
  contact_id?: string;
  deal_id?: string;
  owner_id?: string; // Who performed/assigned
  owner?: Staff; // Join
  created_at: string;
}

export interface Interaction {
  id: string;
  type: ActivityType;
  notes: string;
  date: string;
  contact_id?: string;
  deal_id?: string;
  created_at: string;
}