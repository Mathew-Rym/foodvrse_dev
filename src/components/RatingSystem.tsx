import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RatingSystemProps {
  targetId: string;
  targetType: 'business' | 'listing';
  currentRating?: number;
  averageRating?: number;
  totalRatings?: number;
  showReviewDialog?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingSystem: React.FC<RatingSystemProps> = ({
  targetId,
  targetType,
  currentRating = 0,
  averageRating = 0,
  totalRatings = 0,
  showReviewDialog = false,
  onRatingChange
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReview, setShowReview] = useState(showReviewDialog);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(averageRating);
  const [totalCount, setTotalCount] = useState(totalRatings);

  useEffect(() => {
    fetchCurrentRating();
  }, [targetId, targetType]);

  const fetchCurrentRating = async () => {
    if (!user) return;

    try {
      const tableName = targetType === 'business' ? 'business_ratings' : 'listing_ratings';
      const idField = targetType === 'business' ? 'business_id' : 'listing_id';

      const { data, error } = await supabase
        .from(tableName)
        .select('rating, review_text, review_title')
        .eq(idField, targetId)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setRating(data.rating);
        setReviewText(data.review_text || '');
        setReviewTitle(data.review_title || '');
      }
    } catch (error) {
      console.error('Error fetching current rating:', error);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to submit a rating');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const tableName = targetType === 'business' ? 'business_ratings' : 'listing_ratings';
      const idField = targetType === 'business' ? 'business_id' : 'listing_id';

      const { error } = await supabase
        .from(tableName)
        .upsert({
          [idField]: targetId,
          user_id: user.id,
          rating: rating,
          review_text: reviewText,
          review_title: reviewTitle,
          updated_at: new Date().toISOString()
        }, {
          onConflict: `${idField},user_id`
        });

      if (error) throw error;

      // Update average rating
      await updateAverageRating();
      
      toast.success('Rating submitted successfully!');
      setShowReview(false);
      onRatingChange?.(rating);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAverageRating = async () => {
    try {
      const tableName = targetType === 'business' ? 'business_ratings' : 'listing_ratings';
      const idField = targetType === 'business' ? 'business_id' : 'listing_id';
      const updateTable = targetType === 'business' ? 'business_profiles' : 'listings';

      const { data: ratings, error } = await supabase
        .from(tableName)
        .select('rating')
        .eq(idField, targetId);

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        await supabase
          .from(updateTable)
          .update({
            average_rating: Math.round(averageRating * 100) / 100,
            rating_count: ratings.length,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetId);

        setAvgRating(Math.round(averageRating * 100) / 100);
        setTotalCount(ratings.length);
      }
    } catch (error) {
      console.error('Error updating average rating:', error);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const filled = starValue <= rating;
      
      return (
        <button
          key={index}
          type="button"
          className={`${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          } ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          <Star className={`w-5 h-5 ${filled ? 'fill-current' : ''}`} />
        </button>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Current Rating Display */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {renderStars(avgRating)}
        </div>
        <span className="text-sm text-gray-600">
          {avgRating.toFixed(1)} ({totalCount} {totalCount === 1 ? 'rating' : 'ratings'})
        </span>
      </div>

      {/* Interactive Rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {currentRating > 0 ? 'Update your rating:' : 'Rate this item:'}
        </label>
        <div className="flex items-center gap-2">
          {renderStars(hoverRating || rating, true)}
          <span className="text-sm text-gray-600 ml-2">
            {hoverRating || rating > 0 ? `${hoverRating || rating}/5` : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Review Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReview(true)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        {currentRating > 0 ? 'Update Review' : 'Write a Review'}
      </Button>

      {/* Review Dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {renderStars(hoverRating || rating, true)}
                <span className="text-sm text-gray-600">
                  {hoverRating || rating > 0 ? `${hoverRating || rating}/5` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Review Title (Optional)
              </label>
              <Input
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Brief summary of your experience"
                maxLength={255}
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Review (Optional)
              </label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this item..."
                rows={4}
                maxLength={1000}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleRatingSubmit}
                disabled={isSubmitting || rating === 0}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReview(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 