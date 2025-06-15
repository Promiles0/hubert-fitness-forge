
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
  phone?: string;
  fitness_goals?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  rolesLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}
