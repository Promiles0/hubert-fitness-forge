
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('hubert_fitness_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock login - in a real app, you would connect to your backend
      console.log("Login attempt with:", email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any email/password combination
      // In a real app, you would validate credentials against a backend
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        username: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email.split('@')[0]}`,
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('hubert_fitness_user', JSON.stringify(mockUser));
      
      // Set user in state
      setUser(mockUser);
      
      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
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
      // This is a mock signup - in a real app, you would connect to your backend
      console.log("Signup attempt with:", name, username, email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll create a user locally
      // In a real app, you would register the user in your backend
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: name,
        username: username,
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('hubert_fitness_user', JSON.stringify(mockUser));
      
      // Set user in state
      setUser(mockUser);
      
      // Show success message
      toast({
        title: "Account created",
        description: `Welcome to HUBERT FITNESS, ${name}!`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an issue creating your account. Please try again.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('hubert_fitness_user');
    
    // Clear user from state
    setUser(null);
    
    // Show success message
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to home page
    navigate("/");
  };

  // Authentication context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
