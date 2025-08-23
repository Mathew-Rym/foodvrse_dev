import { supabase } from '@/integrations/supabase/client';

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_logo_url?: string;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  website_url?: string;
  description?: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'active' | 'suspended' | 'verified';
  category: 'restaurant' | 'supermarket' | 'cafe' | 'bakery' | 'food_truck' | 'grocery_store' | 'convenience_store' | 'farmers_market' | 'other';
  verified_at?: string;
  total_sales: number;
  total_revenue: number;
  total_co2_saved_kg: number;
  last_month_sales: number;
  last_month_revenue: number;
  average_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessOwnerDetails {
  business_id: string;
  business_name: string;
  owner_id: string;
  owner_email: string;
  owner_name: string;
  status: string;
  category: string;
  location: string;
  address: string;
}

export class BusinessService {
  // Get current user's business profile
  static async getCurrentUserBusiness(): Promise<BusinessProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching business profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentUserBusiness:', error);
      return null;
    }
  }

  // Check if current user is a business owner
  static async isBusinessOwner(): Promise<boolean> {
    try {
      const business = await this.getCurrentUserBusiness();
      return business !== null;
    } catch (error) {
      console.error('Error checking if user is business owner:', error);
      return false;
    }
  }

  // Create or update business profile
  static async createOrUpdateBusiness(businessData: Partial<BusinessProfile>): Promise<BusinessProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if business profile already exists
      const existingBusiness = await this.getCurrentUserBusiness();

      if (existingBusiness) {
        // Update existing business
        const { data, error } = await supabase
          .from('business_profiles')
          .update({
            ...businessData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new business profile
        const { data, error } = await supabase
          .from('business_profiles')
          .insert({
            user_id: user.id,
            ...businessData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating/updating business:', error);
      return null;
    }
  }

  // Get business owner details
  static async getBusinessOwnerDetails(businessId: string): Promise<BusinessOwnerDetails | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_business_owner_details', { business_uuid: businessId });

      if (error) {
        console.error('Error fetching business owner details:', error);
        return null;
      }

      return data[0] || null;
    } catch (error) {
      console.error('Error in getBusinessOwnerDetails:', error);
      return null;
    }
  }

  // Get all businesses (for admin purposes)
  static async getAllBusinesses(): Promise<BusinessOwnerDetails[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_all_businesses_with_owners');

      if (error) {
        console.error('Error fetching all businesses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllBusinesses:', error);
      return [];
    }
  }

  // Verify business (admin function)
  static async verifyBusiness(businessId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('verify_business', { 
          business_uuid: businessId, 
          admin_user_id: user.id 
        });

      if (error) {
        console.error('Error verifying business:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error in verifyBusiness:', error);
      return false;
    }
  }

  // Get business analytics
  static async getBusinessAnalytics(businessId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('business_analytics')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error) {
        console.error('Error fetching business analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getBusinessAnalytics:', error);
      return null;
    }
  }

  // Update business location
  static async updateBusinessLocation(latitude: number, longitude: number, address: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('business_profiles')
        .update({
          latitude,
          longitude,
          address,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating business location:', error);
      return false;
    }
  }

  // Get businesses by category
  static async getBusinessesByCategory(category: string): Promise<BusinessProfile[]> {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('category', category)
        .eq('status', 'verified')
        .order('business_name');

      if (error) {
        console.error('Error fetching businesses by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBusinessesByCategory:', error);
      return [];
    }
  }

  // Search businesses
  static async searchBusinesses(query: string): Promise<BusinessProfile[]> {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .or(`business_name.ilike.%${query}%,location.ilike.%${query}%`)
        .eq('status', 'verified')
        .order('business_name');

      if (error) {
        console.error('Error searching businesses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchBusinesses:', error);
      return [];
    }
  }
}
