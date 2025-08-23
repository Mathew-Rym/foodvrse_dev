// EmailJS Configuration
// You'll need to set up EmailJS at https://www.emailjs.com/
// and replace these values with your actual credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS public key (found in Account > API Keys)
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ig9EB3sxW-6DL7BoT',
  
  // Your EmailJS service IDs for different purposes
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ia9sy7q',
  SERVICE_PARTNER: import.meta.env.VITE_EMAILJS_SERVICE_PARTNER || 'service_ia9sy7q',
  SERVICE_SUPPORT: import.meta.env.VITE_EMAILJS_SERVICE_SUPPORT || 'service_uh00vy3',
  SERVICE_HEBREW: import.meta.env.VITE_EMAILJS_SERVICE_HEBREW || 'service_cxywhkl',
  SERVICE_RACHEL: import.meta.env.VITE_EMAILJS_SERVICE_RACHEL || 'service_7fgnsfd',
  SERVICE_RYM: import.meta.env.VITE_EMAILJS_SERVICE_RYM || 'service_5ttdiys',
  
  // Your EmailJS template ID (found in Email Templates)
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_business_application',
  
  // Recipient email addresses
  TO_EMAIL_PARTNER: 'partner@foodvrse.com',
  TO_EMAIL_SUPPORT: 'support@foodvrse.com',
  TO_EMAIL_HEBREW: 'hebrew@foodvrse.com',
  TO_EMAIL_RACHEL: 'rachel@foodvrse.com',
  TO_EMAIL_RYM: 'rym@foodvrse.com',
  TO_EMAIL_LOCATION: 'hello@foodvrse.com', // For location requests
};

// EmailJS template parameters structure
export interface EmailJSTemplateParams {
  to_email: string;
  from_name: string;
  from_email: string;
  company: string;
  job_title: string;
  phone: string;
  business_type: string;
  location: string;
  employee_count: string;
  website: string;
  description: string;
  partnership_interest: string;
  monthly_waste: string;
  message: string;
}

// Check if EmailJS is properly configured
export const isEmailJSConfigured = () => {
  return (
    EMAILJS_CONFIG.PUBLIC_KEY && 
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
    EMAILJS_CONFIG.SERVICE_ID && 
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.TEMPLATE_ID && 
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
  );
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  if (typeof window !== 'undefined') {
    if (isEmailJSConfigured()) {
      console.log('✅ EmailJS properly configured');
      console.log('Public Key:', EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('Service ID:', EMAILJS_CONFIG.SERVICE_ID);
      console.log('Template ID:', EMAILJS_CONFIG.TEMPLATE_ID);
    } else {
      console.warn('⚠️ EmailJS not fully configured. Please set up environment variables.');
      console.log('Current config:', {
        PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY,
        SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
        TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID
      });
    }
  }
};
