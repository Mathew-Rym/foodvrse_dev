import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserPreferences {
  id: string;
  user_id: string;
  cookie_consent: boolean;
  analytics_consent: boolean;
  marketing_consent: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  theme_preference: string;
  language_preference: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldShowCookieConsent, setShouldShowCookieConsent] = useState(false);

  // Load user preferences
  const loadPreferences = async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query user preferences directly from user profiles
      const { data, error: dbError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (dbError) {
        console.error('Error loading user preferences:', dbError);
        setError(dbError.message);
        return;
      }

      // Transform to match UserPreferences interface
      const userPreferences: UserPreferences = {
        id: data.id,
        user_id: data.user_id,
        cookie_consent: false, // Default values for missing fields
        analytics_consent: false,
        marketing_consent: false,
        email_notifications: data.email_notifications || true,
        push_notifications: data.push_notifications || true,
        theme_preference: 'light',
        language_preference: 'en',
        last_activity: new Date().toISOString(),
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setPreferences(userPreferences);
    } catch (err) {
      console.error('Error in loadPreferences:', err);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  // Check if should show cookie consent
  const checkShouldShowCookieConsent = () => {
    if (!user || !preferences) return false;

    // Don't show if user has already given consent
    if (preferences.cookie_consent) return false;

    // Check if user just completed onboarding
    const onboardingComplete = localStorage.getItem('foodvrse-onboarding-complete');
    const onboardingJustCompleted = localStorage.getItem('foodvrse-onboarding-just-completed');
    
    if (onboardingJustCompleted === 'true') {
      // Clear the flag and show consent
      localStorage.removeItem('foodvrse-onboarding-just-completed');
      return true;
    }

    // Check if user is returning after a long time (2 weeks)
    if (preferences.last_activity) {
      const lastActivity = new Date(preferences.last_activity);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      if (lastActivity < twoWeeksAgo) {
        return true;
      }
    }

    return false;
  };

  // Update user preferences
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (dbError) {
        console.error('Error updating preferences:', dbError);
        toast.error('Failed to update preferences');
        return;
      }

      // Update local state with new data
      const updatedPreferences: UserPreferences = {
        ...preferences,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      setPreferences(updatedPreferences);
      toast.success('Preferences updated successfully');
    } catch (err) {
      console.error('Error in updatePreferences:', err);
      toast.error('Failed to update preferences');
    }
  };

  // Update cookie consent
  const updateCookieConsent = async (consent: boolean) => {
    await updatePreferences({ 
      cookie_consent: consent,
      last_activity: new Date().toISOString()
    });
    
    // Also update localStorage for immediate access
    localStorage.setItem('foodvrse-cookie-consent', consent ? 'accepted' : 'declined');
    
    // If analytics consent is being granted, also enable analytics
    if (consent) {
      await updatePreferences({ analytics_consent: true });
      initializeAnalytics();
    }

    // Hide the consent banner
    setShouldShowCookieConsent(false);
  };

  // Update analytics consent
  const updateAnalyticsConsent = async (consent: boolean) => {
    await updatePreferences({ analytics_consent: consent });
    
    if (consent) {
      initializeAnalytics();
    } else {
      disableAnalytics();
    }
  };

  // Update last activity
  const updateLastActivity = async () => {
    if (user && preferences) {
      await updatePreferences({ last_activity: new Date().toISOString() });
    }
  };

  // Initialize analytics (Google Analytics)
  const initializeAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Google Analytics is already loaded
      console.log('Analytics enabled');
    } else {
      // Load Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`; // Replace with your GA4 ID
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 ID
      
      console.log('Google Analytics initialized');
    }
  };

  // Disable analytics
  const disableAnalytics = () => {
    // Clear analytics cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('Analytics disabled');
  };

  // Check if user has given consent
  const hasConsent = (type: 'cookie' | 'analytics' | 'marketing') => {
    if (!preferences) return false;
    
    switch (type) {
      case 'cookie':
        return preferences.cookie_consent;
      case 'analytics':
        return preferences.analytics_consent;
      case 'marketing':
        return preferences.marketing_consent;
      default:
        return false;
    }
  };

  // Load preferences when user changes
  useEffect(() => {
    loadPreferences();
  }, [user, isAuthenticated]);

  // Check if should show cookie consent when preferences load
  useEffect(() => {
    if (!loading && preferences) {
      const shouldShow = checkShouldShowCookieConsent();
      setShouldShowCookieConsent(shouldShow);
    }
  }, [loading, preferences]);

  // Update activity on user interaction
  useEffect(() => {
    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Track user activity
    const events = ['click', 'scroll', 'keypress', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user, preferences]);

  return {
    preferences,
    loading,
    error,
    shouldShowCookieConsent,
    updatePreferences,
    updateCookieConsent,
    updateAnalyticsConsent,
    hasConsent,
    initializeAnalytics,
    disableAnalytics,
    loadPreferences,
    updateLastActivity
  };
}; 