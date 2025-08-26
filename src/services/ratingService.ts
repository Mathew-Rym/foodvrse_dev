import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RatingData {
  rating: number;
  review_text?: string;
  review_title?: string;
}

export interface BusinessRating extends RatingData {
  business_id: string;
}

export interface ListingRating extends RatingData {
  listing_id: string;
}

export interface RatingResponse {
  average_rating: number;
  total_ratings: number;
  user_rating?: number;
  user_review?: string;
}

export class RatingService {
  // Rate a business
  static async rateBusiness(businessId: string, ratingData: RatingData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_ratings')
        .upsert({
          business_id: businessId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          rating: ratingData.rating,
          review_text: ratingData.review_text,
          review_title: ratingData.review_title,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'business_id,user_id'
        });

      if (error) throw error;

      // Update business average rating
      await this.updateBusinessAverageRating(businessId);
      
      toast.success('Rating submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error rating business:', error);
      toast.error('Failed to submit rating');
      return false;
    }
  }

  // Rate a listing
  static async rateListing(listingId: string, ratingData: RatingData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('listing_ratings')
        .upsert({
          listing_id: listingId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          rating: ratingData.rating,
          review_text: ratingData.review_text,
          review_title: ratingData.review_title,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'listing_id,user_id'
        });

      if (error) throw error;

      // Update listing average rating
      await this.updateListingAverageRating(listingId);
      
      toast.success('Rating submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error rating listing:', error);
      toast.error('Failed to submit rating');
      return false;
    }
  }

  // Get business rating data
  static async getBusinessRating(businessId: string): Promise<RatingResponse | null> {
    try {
      const { data: ratings, error } = await supabase
        .from('business_ratings')
        .select('rating, review_text')
        .eq('business_id', businessId);

      if (error) throw error;

      if (!ratings || ratings.length === 0) {
        return { average_rating: 0, total_ratings: 0 };
      }

      const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      const userRating = ratings.find(r => r.user_id === (await supabase.auth.getUser()).data.user?.id);

      return {
        average_rating: Math.round(averageRating * 100) / 100,
        total_ratings: ratings.length,
        user_rating: userRating?.rating,
        user_review: userRating?.review_text
      };
    } catch (error) {
      console.error('Error getting business rating:', error);
      return null;
    }
  }

  // Get listing rating data
  static async getListingRating(listingId: string): Promise<RatingResponse | null> {
    try {
      const { data: ratings, error } = await supabase
        .from('listing_ratings')
        .select('rating, review_text')
        .eq('listing_id', listingId);

      if (error) throw error;

      if (!ratings || ratings.length === 0) {
        return { average_rating: 0, total_ratings: 0 };
      }

      const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      const userRating = ratings.find(r => r.user_id === (await supabase.auth.getUser()).data.user?.id);

      return {
        average_rating: Math.round(averageRating * 100) / 100,
        total_ratings: ratings.length,
        user_rating: userRating?.rating,
        user_review: userRating?.review_text
      };
    } catch (error) {
      console.error('Error getting listing rating:', error);
      return null;
    }
  }

  // Update business average rating
  private static async updateBusinessAverageRating(businessId: string): Promise<void> {
    try {
      const { data: ratings, error } = await supabase
        .from('business_ratings')
        .select('rating')
        .eq('business_id', businessId);

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        await supabase
          .from('business_profiles')
          .update({
            average_rating: Math.round(averageRating * 100) / 100,
            rating_count: ratings.length,
            updated_at: new Date().toISOString()
          })
          .eq('id', businessId);
      }
    } catch (error) {
      console.error('Error updating business average rating:', error);
    }
  }

  // Update listing average rating
  private static async updateListingAverageRating(listingId: string): Promise<void> {
    try {
      const { data: ratings, error } = await supabase
        .from('listing_ratings')
        .select('rating')
        .eq('listing_id', listingId);

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        await supabase
          .from('mystery_bags')
          .update({
            average_rating: Math.round(averageRating * 100) / 100,
            rating_count: ratings.length,
            updated_at: new Date().toISOString()
          })
          .eq('id', listingId);
      }
    } catch (error) {
      console.error('Error updating listing average rating:', error);
    }
  }
} 