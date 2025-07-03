
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isPartner?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login logic - in a real app this would make an API call
    console.log('Login attempt:', email);
    
    // Mock user data - you can modify this for testing
    const mockUser: User = {
      id: '1',
      email: email,
      name: 'John Doe',
      isPartner: email.includes('partner') // Simple logic to test partner status
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  const value = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
