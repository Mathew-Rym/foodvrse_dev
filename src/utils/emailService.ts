// cPanel Email Service
// This replaces EmailJS with direct email using your cPanel

interface EmailData {
  to: string;
  from: string;
  subject: string;
  message: string;
  name: string;
}

// EmailJS fallback (if cPanel fails)
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Try cPanel email first
    const cpanelSuccess = await sendViaCpanel(emailData);
    if (cpanelSuccess) {
      console.log('✅ Email sent via cPanel');
      return true;
    }
    
    // Fallback to EmailJS if cPanel fails
    console.log('⚠️ cPanel failed, trying EmailJS fallback');
    return await sendViaEmailJS(emailData);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

const sendViaCpanel = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Create form data for cPanel email
    const formData = new FormData();
    formData.append('to', emailData.to);
    formData.append('from', emailData.from);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    formData.append('name', emailData.name);
    
    // Send to your cPanel email handler
    const response = await fetch('https://foodvrse.com/send-email.php', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.success === true;
    }
    
    return false;
  } catch (error) {
    console.error('cPanel email error:', error);
    return false;
  }
};

const sendViaEmailJS = async (emailData: EmailData): Promise<boolean> => {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_contact_form',
      {
        to_email: emailData.to,
        from_name: emailData.name,
        from_email: emailData.from,
        subject: emailData.subject,
        message: emailData.message
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};

