
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

// Helper function to send welcome email
const sendWelcomeEmail = async (name: string, email: string) => {
  try {
    const response = await fetch('https://aotcazibvafyqufeuplx.supabase.co/functions/v1/send-contact-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdGNhemlidmFmeXF1ZmV1cGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTg3MzEsImV4cCI6MjA2MzA5NDczMX0.RgfYvyXHKe9_saBr7Mwjgo5OjlToeyEpEK0LH50aIPA`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdGNhemlidmFmeXF1ZmV1cGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTg3MzEsImV4cCI6MjA2MzA5NDczMX0.RgfYvyXHKe9_saBr7Mwjgo5OjlToeyEpEK0LH50aIPA',
      },
      body: JSON.stringify({
        type: 'welcome',
        name,
        email,
      }),
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('Welcome email sent successfully');
    } else {
      console.error('Failed to send welcome email:', data.error);
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Helper function to transform Supabase user to our User type
const transformUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
  if (!supabaseUser) return null;

  try {
    // Get the user's profile from the profiles table - use maybeSingle instead of single
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, username, avatar, first_name, last_name')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Don't throw error, just continue with basic user data
    }

    // Get the user's roles from the user_roles table
    const { data: rolesData, error: rolesError } = await supabase
      .rpc('get_user_roles', { _user_id: supabaseUser.id });

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      // Don't throw error, just continue without roles
    }

    // Transform roles data to string array
    const roles = rolesData ? rolesData as string[] : [];

    // Use profile data if available, otherwise fall back to basic user info
    const displayName = profileData?.name || 
                       (profileData?.first_name && profileData?.last_name ? `${profileData.first_name} ${profileData.last_name}` : null) ||
                       supabaseUser.user_metadata?.name || 
                       supabaseUser.email?.split('@')[0] || 
                       'User';

    const username = profileData?.username || 
                    supabaseUser.user_metadata?.username || 
                    supabaseUser.email?.split('@')[0] || 
                    'user';

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: displayName,
      username: username,
      avatar: profileData?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      roles: roles,
    };
  } catch (error) {
    console.error('Error in transformUser:', error);
    // Return basic user info even if profile fetch fails
    const fallbackUsername = supabaseUser.email?.split('@')[0] || 'user';
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || fallbackUsername,
      username: fallbackUsername,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fallbackUsername}`,
      roles: [],
    };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        // Defer user profile fetching to prevent Supabase deadlocks
        if (currentSession?.user) {
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const transformedUser = await transformUser(currentSession.user);
              if (mounted) {
                setUser(transformedUser);
                setIsLoading(false);
              }
            } catch (error) {
              console.error('Error transforming user:', error);
              if (mounted) {
                setIsLoading(false);
              }
            }
          }, 0);
        } else {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession?.user?.id);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          const transformedUser = await transformUser(currentSession.user);
          if (mounted) {
            setUser(transformedUser);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Function to check if a user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Login function with role-based routing
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch transformed user including roles
      const transformedUser = await transformUser(data.user);
      setUser(transformedUser);

      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      // Redirect based on role - admin goes to admin dashboard, members to member dashboard
      if (transformedUser?.roles?.includes('admin')) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      let message = "Please check your credentials and try again.";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Login failed",
        description: message,
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

      // Send welcome email after successful signup
      await sendWelcomeEmail(name, email);

      // Show success message
      toast({
        title: "Account created",
        description: `Welcome to HUBERT FITNESS, ${username}! Check your email for a welcome message.`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: unknown) {
      let message = "There was an issue creating your account. Please try again.";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Signup failed",
        description: message,
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
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear user from state
      setUser(null);
      setSession(null);
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home
      navigate("/");
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
