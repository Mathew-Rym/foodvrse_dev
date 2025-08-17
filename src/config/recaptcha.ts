// reCAPTCHA Configuration
export const RECAPTCHA_CONFIG = {
  // Your reCAPTCHA site key (get from https://www.google.com/recaptcha/admin)
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LfOA04pAAAAAL9ttkwIz40hC63_7IsaU2MgcwVH',
  
  // reCAPTCHA secret key (for server-side verification - not used in frontend)
  SECRET_KEY: import.meta.env.VITE_RECAPTCHA_SECRET_KEY || 'YOUR_RECAPTCHA_SECRET_KEY'
};

// Initialize reCAPTCHA
export const initializeRecaptcha = () => {
  if (typeof window !== 'undefined') {
    console.log('reCAPTCHA configuration loaded');
  }
}; 