
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuthActions } from '@/hooks/useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, isInitialized } = useAuthState();
  const { data: profile } = useUserProfile(user, isInitialized);
  const { data: userRoles = [], isLoading: rolesLoading } = useUserRoles(user, isInitialized);
  const { login, signup, logout } = useAuthActions();

  const hasRole = (role: string) => {
    // Don't check roles until they're loaded and user is initialized
    if (!isInitialized || rolesLoading || !user) {
      return false;
    }
    
    const result = userRoles.includes(role);
    console.log(`Checking role "${role}" for user ${user.id}:`, result, 'Available roles:', userRoles);
    return result;
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated,
    loading: loading || !isInitialized,
    rolesLoading,
    login,
    signup,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
