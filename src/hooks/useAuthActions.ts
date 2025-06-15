
import { supabase } from '@/integrations/supabase/client';

export const useAuthActions = () => {
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.user) {
      // Wait a moment for the auth state to be fully set
      setTimeout(async () => {
        // Check user role and redirect accordingly
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id);
        
        console.log('Login roles check:', roles);
        
        if (roles && roles.some(r => r.role === 'admin')) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 100);
    }
    
    return { error };
  };

  const signup = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return { login, signup, logout };
};
