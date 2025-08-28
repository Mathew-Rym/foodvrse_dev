import { supabase } from '@/integrations/supabase/client';

// Approved business partner email domains
const APPROVED_BUSINESS_DOMAINS = [
  'java-house.com',
  'artcaffe.co.ke',
  'kfc.co.ke',
  'pizzainn.co.ke',
  'galitos.co.ke',
  'naivas.co.ke',
  'carrefour.ke',
  'tuskys.com',
  'quickmart.co.ke',
  'choppies.co.ke',
  'serenahotels.com',
  'fairmont.com',
  'hilton.com',
  'marriott.com',
  'radisson.com'
];

// Specific approved business emails (for individual businesses)
const APPROVED_BUSINESS_EMAILS = [
  'admin@javahousekenya.com',
  'manager@artcaffegroup.com',
  'operations@galitoskenya.com',
  'partnerships@naivaskenya.com',
  'contact@pizzainnkenya.com'
];

export interface BusinessPartnerCheck {
  status?: string;
  userId?: string;
  isBusinessPartner: boolean;
  partnerType: 'domain' | 'email' | 'database' | null;
  businessName?: string;
}

/**
 * Check if an email belongs to an approved business partner
 */
export const checkIfBusinessPartner = async (email: string): Promise<BusinessPartnerCheck> => {
  try {
    const emailLower = email.toLowerCase();
    const domain = emailLower.split('@')[1];

    // First check: Approved email domains
    if (APPROVED_BUSINESS_DOMAINS.includes(domain)) {
      return {
        isBusinessPartner: true,
        partnerType: 'domain',
        businessName: getBusinessNameFromDomain(domain)
      };
    }

    // Second check: Specific approved emails
    if (APPROVED_BUSINESS_EMAILS.includes(emailLower)) {
      return {
        isBusinessPartner: true,
        partnerType: 'email',
        businessName: getBusinessNameFromEmail(emailLower)
      };
    }

    // Third check: Database lookup for registered business partners
    const { data: businessPartner, error } = await supabase
      .from('business_profiles')
      .select('business_name, status, user_id')
      .eq('contact_email', emailLower)
      .single();

    if (!error && businessPartner) {
      // Check status and return appropriate response
      if (businessPartner.status === 'verified') {
        return {
          isBusinessPartner: true,
          partnerType: 'database',
          businessName: businessPartner.business_name,
          status: businessPartner.status,
          userId: businessPartner.user_id
        };
      } else if (businessPartner.status === 'pending') {
        return {
          isBusinessPartner: false,
          partnerType: 'pending',
          businessName: businessPartner.business_name,
          status: businessPartner.status,
          userId: businessPartner.user_id
        };
      } else if (businessPartner.status === 'rejected') {
        return {
          isBusinessPartner: false,
          partnerType: 'rejected',
          businessName: businessPartner.business_name,
          status: businessPartner.status,
          userId: businessPartner.user_id
        };
      }
    }

    // Not a business partner
    return {
      isBusinessPartner: false,
      partnerType: null
    };

  } catch (error) {
    console.error('Error checking business partner status:', error);
    // Default to regular user on error
    return {
      isBusinessPartner: false,
      partnerType: null
    };
  }
};

/**
 * Get business name from domain
 */
const getBusinessNameFromDomain = (domain: string): string => {
  const domainMap: Record<string, string> = {
    'java-house.com': 'Java House',
    'artcaffe.co.ke': 'Artcaffe',
    'kfc.co.ke': 'KFC Kenya',
    'pizzainn.co.ke': 'Pizza Inn',
    'galitos.co.ke': 'Galito\'s',
    'naivas.co.ke': 'Naivas',
    'carrefour.ke': 'Carrefour',
    'tuskys.com': 'Tuskys',
    'quickmart.co.ke': 'Quickmart',
    'choppies.co.ke': 'Choppies',
    'serenahotels.com': 'Serena Hotels',
    'fairmont.com': 'Fairmont Hotels',
    'hilton.com': 'Hilton Hotels',
    'marriott.com': 'Marriott Hotels',
    'radisson.com': 'Radisson Hotels'
  };

  return domainMap[domain] || domain.split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get business name from specific email
 */
const getBusinessNameFromEmail = (email: string): string => {
  const emailMap: Record<string, string> = {
    'admin@javahousekenya.com': 'Java House Kenya',
    'manager@artcaffegroup.com': 'Artcaffe Group',
    'operations@galitoskenya.com': 'Galito\'s Kenya',
    'partnerships@naivaskenya.com': 'Naivas Kenya',
    'contact@pizzainnkenya.com': 'Pizza Inn Kenya'
  };

  return emailMap[email] || 'Business Partner';
};

// Note: registerBusinessPartner function removed as business_partners table was dropped
// Business partner registration is now handled through business_profiles table