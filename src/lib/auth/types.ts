
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    data: { user: User | null; session: Session | null };
    error: any;
  }>;
  signUp: (email: string, password: string, username?: string) => Promise<{
    data: { user: User | null; session: Session | null };
    error: any;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    data: any;
    error: any;
  }>;
}
