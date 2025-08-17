// reCAPTCHA Configuration
export const RECAPTCHA_CONFIG = {
  // Your reCAPTCHA site key (get from https://www.google.com/recaptcha/admin)
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcgnagrAAAAAACe1khNZDzj1GoGNaZc9lr3cvF1',
  
  // reCAPTCHA secret key (for server-side verification - not used in frontend)
  SECRET_KEY: import.meta.env.VITE_RECAPTCHA_SECRET_KEY || '6LcgnagrAAAAAACEDr-MarZg16w3T0ZycvWFYr-R'
};

// Initialize reCAPTCHA
export const initializeRecaptcha = () => {
  if (typeof window !== 'undefined') {
    console.log('reCAPTCHA configuration loaded');
  }
}; 