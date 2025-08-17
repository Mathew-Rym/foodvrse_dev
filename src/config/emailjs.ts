// EmailJS Configuration
// You'll need to set up EmailJS at https://www.emailjs.com/
// and replace these values with your actual credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS public key (found in Account > API Keys)
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY',
  
  // Your EmailJS service ID (found in Email Services)
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  
  // Your EmailJS template ID (found in Email Templates)
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  
  // Recipient email address
  TO_EMAIL: 'hello@foodvrse.com'
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

// Initialize EmailJS
export const initializeEmailJS = () => {
  if (typeof window !== 'undefined') {
    // EmailJS will be initialized in the component
    console.log('EmailJS configuration loaded');
  }
}; 