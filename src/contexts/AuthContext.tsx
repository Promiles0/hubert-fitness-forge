
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  roles?: string[]; // Add roles property
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean; // Add role check function
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to transform Supabase user to our User type
const transformUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    // Get the user's profile from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, username, avatar')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError) throw profileError;

    // Get the user's roles from the user_roles table
    const { data: rolesData, error: rolesError } = await supabase
      .rpc('get_user_roles', { _user_id: supabaseUser.id });

    if (rolesError) throw rolesError;

    // Transform roles data to string array
    const roles = rolesData ? rolesData as string[] : [];

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profileData?.name || supabaseUser.email?.split('@')[0] || '',
      username: profileData?.username || supabaseUser.email?.split('@')[0] || '',
      avatar: profileData?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData?.username || supabaseUser.email?.split('@')[0]}`,
      roles: roles,
    };
  } catch (error) {
    console.error('Error fetching user profile or roles:', error);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || '',
      username: supabaseUser.email?.split('@')[0] || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${supabaseUser.email?.split('@')[0]}`,
      roles: [],
    };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to clean up Supabase auth state (prevents auth limbo)
  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        // Defer user profile fetching to prevent Supabase deadlocks
        if (currentSession?.user) {
          setTimeout(async () => {
            const transformedUser = await transformUser(currentSession.user);
            setUser(transformedUser);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          const transformedUser = await transformUser(currentSession.user);
          setUser(transformedUser);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to check if a user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      // Force navigation to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
          },
        },
      });

      if (error) throw error;

      // Show success message
      toast({
        title: "Account created",
        description: `Welcome to HUBERT FITNESS, ${username}!`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "There was an issue creating your account. Please try again.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear user from state
      setUser(null);
      setSession(null);
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Force page reload for a clean state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Authentication context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
