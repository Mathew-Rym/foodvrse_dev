
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { API_CONFIG } from '@/config/api';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const Analytics = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { hasConsent } = useUserPreferences();

  // Track page views
  useEffect(() => {
    if (hasConsent('analytics') && window.gtag) {
      window.gtag('config', API_CONFIG.GOOGLE_ANALYTICS_ID, {
        page_path: location.pathname + location.search,
        user_id: user?.id || 'anonymous'
      });
    }
  }, [location, user, hasConsent]);

  return null;
};

// Analytics event tracking functions
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// User authentication events
export const trackSignUp = (method: string, userType: string = 'consumer') => {
  trackEvent('sign_up', {
    method,
    user_type: userType
  });
};

export const trackLogin = (method: string) => {
  trackEvent('login', {
    method
  });
};

// Business events
export const trackBusinessSignup = (businessType: string, location: string) => {
  trackEvent('business_signup', {
    business_type: businessType,
    location
  });
};

export const trackPartnerApplication = (applicationType: string) => {
  trackEvent('partner_application', {
    application_type: applicationType
  });
};

// Food waste reduction events
export const trackOrderPlaced = (orderValue: number, foodItems: number, wasteSaved: string) => {
  trackEvent('order_placed', {
    order_value: orderValue,
    food_items: foodItems,
    waste_saved: wasteSaved
  });
};

export const trackImpactMilestone = (milestoneType: string, milestoneValue: number) => {
  trackEvent('impact_milestone', {
    milestone_type: milestoneType,
    milestone_value: milestoneValue
  });
};

// User engagement events
export const trackVideoWatch = (videoTitle: string, watchTime: number) => {
  trackEvent('video_watch', {
    video_title: videoTitle,
    watch_time: watchTime
  });
};

export const trackFeatureUsage = (featureName: string, userType: string) => {
  trackEvent('feature_used', {
    feature_name: featureName,
    user_type: userType
  });
};

// E-commerce events
export const trackPurchase = (transactionId: string, value: number, currency: string, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items
  });
};

// Custom user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

// Set user type
export const setUserType = (userType: string) => {
  setUserProperties({
    user_type: userType
  });
};

// Set user location
export const setUserLocation = (location: string) => {
  setUserProperties({
    user_location: location
  });
};

export default Analytics;
