
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PurchaseImpactService } from "@/services/purchaseImpactService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  userImpact: any | null;
  businessProfile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: (isBusinessAuth?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
updateUserImpactFromPurchase: (purchaseData: any) => Promise<void>;
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
    // Handle OAuth callback and profile creation
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        
        // Check if user needs profile setup
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();

        if (!profile) {
          // Create user profile automatically
          await createUserProfile(data.session.user);
        }

        await fetchUserData(data.session.user.id);
      }
      setLoading(false);
    };

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

    // Handle OAuth callback if needed
    if (window.location.search.includes('access_token') || window.location.search.includes('error')) {
      handleOAuthCallback();
    }

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: any) => {
    try {
      // Extract first name from Google user data
      let firstName = 'User';
      if (user.user_metadata?.full_name) {
        firstName = user.user_metadata.full_name.split(' ')[0];
      } else if (user.user_metadata?.name) {
        firstName = user.user_metadata.name.split(' ')[0];
      } else if (user.email) {
        firstName = user.email.split('@')[0];
      }

      // Check if this is a business auth
      const isBusinessAuth = sessionStorage.getItem('google_business_auth') === 'true';
      sessionStorage.removeItem('google_business_auth');

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          display_name: firstName,
          avatar_url: user.user_metadata?.avatar_url || null,
          user_type: isBusinessAuth ? 'business' : 'consumer',
          email_notifications: true,
          push_notifications: true,
          notifications_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast.error('Failed to create profile. Please try again.');
        return;
      }

      // Create user impact record
      const { error: impactError } = await supabase
        .from('user_impact')
        .insert({
          user_id: user.id,
          total_orders: 0,
          total_savings: 0,
          total_co2_saved: 0,
          total_food_waste_prevented: 0,
          weekly_challenge_progress: 0,
          community_achievements: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (impactError) {
        console.error('Impact creation error:', impactError);
        // Don't fail the whole process for impact creation error
      }

              // If business auth, create business profile
        if (isBusinessAuth) {
          const { error: businessError } = await supabase
            .from('business_profiles')
            .insert({
              user_id: user.id,
              business_name: `${firstName}'s Business`,
              address: 'To be updated',
              location: 'To be updated',
              user_type: 'business',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (businessError) {
            console.error('Business profile creation error:', businessError);
            // Don't fail the whole process for business profile error
          }
        }

      toast.success(`Welcome ${firstName}! Your account has been set up successfully.`);
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

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

  const signInWithGoogle = async (isBusinessAuth = false) => {
    try {
      // Use dynamic redirect URL based on environment
      const redirectUrl = import.meta.env.PROD 
        ? 'https://www.foodvrse.com/oauth-callback'
        : `${window.location.origin}/oauth-callback`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile openid',
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        toast.error(error.message);
        return { error };
      }

      // Store business auth flag for after redirect
      if (isBusinessAuth) {
        sessionStorage.setItem('google_business_auth', 'true');
      }

      toast.success('Redirecting to Google...');
      return { error: null };
    } catch (error: any) {
      console.error('Google OAuth exception:', error);
      toast.error('Google sign-in failed');
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

  const updateUserImpactFromPurchase = async (purchaseData: any) => {
    if (!user) return;
    
    try {
      // Update impact using the service
      const updatedProgress = await PurchaseImpactService.updateImpactFromPurchase(purchaseData);
      
      // Update local state
      setUserImpact(updatedProgress);
      
      // Refresh user data to get latest info
      await fetchUserData(user.id);
    } catch (error) {
      console.error("Error updating impact from purchase:", error);
      toast.error("Failed to update impact");
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
    signInWithGoogle,
    signOut,
    refreshUserData,
updateUserImpactFromPurchase,
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
