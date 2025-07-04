
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  isPartner?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
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
    console.log('Login attempt:', email);
    
    const mockUser: User = {
      id: '1',
      email: email,
      name: 'John Doe',
      isPartner: email.includes('partner')
    };
    
    setUser(mockUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    console.log('Signup attempt:', email, name);
    
    const mockUser: User = {
      id: '1',
      email: email,
      name: name,
      isPartner: email.includes('partner')
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const isAuthenticated = user !== null;

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
