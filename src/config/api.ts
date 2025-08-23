// API Configuration for FoodVrse
// Environment variables should be set in your deployment platform

export const API_CONFIG = {
  // Google Maps API
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  
  // Google OAuth
  GOOGLE_OAUTH_CLIENT_ID: '707536400304-6ogfei7hql85l4csjch467922du99hur.apps.googleusercontent.com',
  
  // Google Analytics
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  GOOGLE_TAG_MANAGER_ID: import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID || '',
  
  // Supabase (already configured in client.ts)
  SUPABASE_URL: 'https://vsvhkkalfziuyttwityc.supabase.co',
  
  // OneSignal (if using push notifications)
  ONESIGNAL_APP_ID: import.meta.env.VITE_ONESIGNAL_APP_ID || '',
  
  // YouTube (for video modal)
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
} as const;

// Validate required API keys
export const validateApiKeys = () => {
  const missingKeys = [];
  
  if (!API_CONFIG.GOOGLE_MAPS_API_KEY) {
    missingKeys.push('GOOGLE_MAPS_API_KEY');
  }
  
  if (!API_CONFIG.GOOGLE_OAUTH_CLIENT_ID) {
    missingKeys.push('GOOGLE_OAUTH_CLIENT_ID');
  }
  
  if (missingKeys.length > 0) {
    console.warn('Missing API keys:', missingKeys);
  }
  
  return missingKeys.length === 0;
};

// Initialize API validation
validateApiKeys(); 