import { BusinessService } from "@/services/businessService";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PurchaseImpactService } from "@/services/purchaseImpactService";
import { checkIfBusinessPartner, registerBusinessPartner } from "@/services/businessPartnerService";

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
  ensureUserProfile: () => Promise<any>;
updateUserImpactFromPurchase: (purchaseData: any) => Promise<void>;
  getDashboardRedirectPath: (email: string) => Promise<string>;
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
    // Handle OAuth callback - simplified without automatic profile creation
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        
        // Track login time for cookie consent logic
        localStorage.setItem('foodvrse-last-login-time', new Date().toISOString());
        
        // Fetch user data in background (non-blocking)
        fetchUserData(data.session.user.id).catch(error => {
          console.warn('OAuth callback user data fetch failed:', error);
        });
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
          // Track login time for cookie consent logic
          localStorage.setItem('foodvrse-last-login-time', new Date().toISOString());
          
          // Fast initial setup - don't wait for user data
          setLoading(false);
          
          // Fetch user data in background (non-blocking)
          fetchUserData(session.user.id).catch(error => {
            console.warn('Background user data fetch failed:', error);
          });
        } else {
          setUserProfile(null);
          setUserImpact(null);
          setBusinessProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Fetch user data in background (non-blocking)
        fetchUserData(session.user.id).catch(error => {
          console.warn('Initial user data fetch failed:', error);
        });
      }
    }).catch(error => {
      console.error('Failed to get session:', error);
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
      // Extract display name from user data - prioritize user_metadata over email
      let displayName = 'User';
      if (user.user_metadata?.full_name) {
        displayName = user.user_metadata.full_name;
      } else if (user.user_metadata?.name) {
        displayName = user.user_metadata.name;
      } else if (user.user_metadata?.display_name) {
        displayName = user.user_metadata.display_name;
      } else if (user.email) {
        displayName = user.email.split('@')[0];
      }

      // Check if this is a business partner based on email
      const businessCheck = await checkIfBusinessPartner(user.email);
      const isBusinessAuth = businessCheck.isBusinessPartner || sessionStorage.getItem('google_business_auth') === 'true';
      sessionStorage.removeItem('google_business_auth');

      // Register as business partner if detected
      if (businessCheck.isBusinessPartner && businessCheck.businessName) {
        await registerBusinessPartner(user.email, businessCheck.businessName);
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          display_name: displayName,
          avatar_url: user.user_metadata?.avatar_url || null,
          user_type: isBusinessAuth ? 'business' : 'consumer',
          email_notifications: true,
          push_notifications: true,
          notifications_enabled: true,
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
          total_orders: 0,
          total_savings: 0,
          total_co2_saved: 0,
          total_food_waste_prevented: 0,
          weekly_challenge_progress: 0,
          community_achievements: 0,
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
            business_name: `${displayName}'s Business`,
            address: 'To be updated',
            location: 'To be updated',
            user_type: 'business',
          });

        if (businessError) {
          console.error('Business profile creation error:', businessError);
          // Don't fail the whole process for business profile error
        }
      }

      toast.success(`Welcome ${displayName}! Your account has been set up successfully.`);
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Use parallel requests for better performance
      const [profileResult, impactResult, businessResult] = await Promise.allSettled([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('user_impact')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
      ]);

      // Handle user profile
      if (profileResult.status === 'fulfilled' && !profileResult.value.error) {
        const profile = profileResult.value.data;
        setUserProfile(profile);
        
        // Sync display name from auth user if different
        if (profile && user) {
          const authDisplayName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name;
          if (authDisplayName && profile.display_name !== authDisplayName) {
            await syncDisplayName(userId, authDisplayName);
          }
        }
      } else if (profileResult.status === 'rejected' || profileResult.value.error) {
        console.warn('User profile not found or error:', profileResult.status === 'rejected' ? profileResult.reason : profileResult.value.error);
        setUserProfile(null);
      }

      // Handle user impact
      if (impactResult.status === 'fulfilled' && !impactResult.value.error) {
        setUserImpact(impactResult.value.data);
      } else {
        setUserImpact(null);
      }

      // Handle business profile
      if (businessResult.status === 'fulfilled' && !businessResult.value.error) {
        setBusinessProfile(businessResult.value.data);
      } else {
        setBusinessProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set defaults on error
      setUserProfile(null);
      setUserImpact(null);
      setBusinessProfile(null);
    }
  };

  // Sync display name from authentication user to user_profiles
  const syncDisplayName = async (userId: string, displayName: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          display_name: displayName,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error syncing display name:', error);
      } else {
        // Update local state
        setUserProfile(prev => prev ? { ...prev, display_name: displayName } : null);
      }
    } catch (error) {
      console.error('Error syncing display name:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/discover`;
      
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
            prompt: 'select_account', // Faster than 'consent'
          },
          scopes: 'email profile',
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
        // Clear remember me data on sign out
        localStorage.removeItem('foodvrse_saved_email');
        localStorage.removeItem('foodvrse_remember_me');
        toast.success('Signed out successfully');
        // Clear remember me data on sign out
        localStorage.removeItem('foodvrse_saved_email');
        localStorage.removeItem('foodvrse_remember_me');
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

  // Lazy profile creation - only create when specifically needed
  const ensureUserProfile = async () => {
    if (!user) return null;
    
    // If profile already exists, return it
    if (userProfile) return userProfile;
    
    try {
      // Check if profile exists in database
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (existingProfile) {
        setUserProfile(existingProfile);
        return existingProfile;
      }
      
      // Create profile only if it doesn't exist
      await createUserProfile(user);
      await fetchUserData(user.id);
      return userProfile;
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      toast.error('Unable to create user profile. Please try again.');
      return null;
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

  const getDashboardRedirectPath = async (email: string): Promise<string> => {
    try {
      const businessCheck = await checkIfBusinessPartner(email);
      
      if (businessCheck.isBusinessPartner) {
        return '/business-dashboard';
      } else {
        return '/discover';
      }
    } catch (error) {
      console.error('Error determining dashboard path:', error);
      // Default to user dashboard on error
      return '/discover';
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
    ensureUserProfile,
    updateUserImpactFromPurchase,
    getDashboardRedirectPath,
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
