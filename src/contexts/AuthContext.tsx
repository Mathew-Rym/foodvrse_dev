
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  userImpact: any | null;
  businessProfile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
  isBusinessUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userImpact, setUserImpact] = useState<any | null>(null);
  const [businessProfile, setBusinessProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer additional data fetching to avoid deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setUserImpact(null);
          setBusinessProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserData(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setUserProfile(profile);

      // Fetch user impact
      const { data: impact } = await supabase
        .from('user_impact')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setUserImpact(impact);

      // Fetch business profile if user is a business owner
      const { data: business } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setBusinessProfile(business);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Check your email to confirm your account!');
      return { error: null };
    } catch (error: any) {
      toast.error('Sign up failed');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Welcome back!');
      return { error: null };
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error('Login failed');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed');
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const isAuthenticated = !!user;
  const isBusinessUser = !!businessProfile;

  const value = {
    user,
    session,
    userProfile,
    userImpact,
    businessProfile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserData,
    isAuthenticated,
    isBusinessUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
