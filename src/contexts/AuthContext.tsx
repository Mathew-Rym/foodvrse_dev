
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
  isPartner: boolean;
}

interface AuthContextType {
  user: User | null;
  loginConsumer: (email: string, password: string) => Promise<void>;
  loginBusiness: (email: string, password: string) => Promise<void>;
  signupConsumer: (email: string, password: string, name: string) => Promise<void>;
  signupBusiness: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isBusinessUser: boolean;
  isConsumerUser: boolean;
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

  const loginConsumer = async (email: string, password: string) => {
    console.log('Consumer login attempt:', email);
    
    const mockUser: User = {
      id: 'consumer_' + Date.now(),
      email: email,
      name: 'Consumer User',
      isPartner: false
    };
    
    setUser(mockUser);
  };

  const loginBusiness = async (email: string, password: string) => {
    console.log('Business login attempt:', email);
    
    const mockUser: User = {
      id: 'business_' + Date.now(),
      email: email,
      name: 'Business Owner',
      isPartner: true
    };
    
    setUser(mockUser);
  };

  const signupConsumer = async (email: string, password: string, name: string) => {
    console.log('Consumer signup attempt:', email, name);
    
    const mockUser: User = {
      id: 'consumer_' + Date.now(),
      email: email,
      name: name,
      isPartner: false
    };
    
    setUser(mockUser);
  };

  const signupBusiness = async (email: string, password: string, name: string) => {
    console.log('Business signup attempt:', email, name);
    
    const mockUser: User = {
      id: 'business_' + Date.now(),
      email: email,
      name: name,
      isPartner: true
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
  const isBusinessUser = user?.isPartner === true;
  const isConsumerUser = user?.isPartner === false;

  const value = {
    user,
    loginConsumer,
    loginBusiness,
    signupConsumer,
    signupBusiness,
    logout,
    updateProfile,
    isAuthenticated,
    isBusinessUser,
    isConsumerUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
