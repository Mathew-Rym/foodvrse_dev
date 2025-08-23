import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface GoogleOAuthHandlerProps {
  onComplete: () => void;
}

const GoogleOAuthHandler: React.FC<GoogleOAuthHandlerProps> = ({ onComplete }) => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your login...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!user) return;

      // Check if user already has a profile
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // User already has a profile, redirect to appropriate dashboard
        setStatus('success');
        setMessage('Welcome back! Redirecting...');
        setTimeout(() => {
          if (existingProfile.user_type === 'business') {
            navigate('/business-dashboard');
          } else {
            navigate('/profile');
          }
        }, 1500);
        return;
      }

      // Automatically create profile without user input
      await createProfileAutomatically();
    };

    handleOAuthCallback();
  }, [user, navigate]);

  const createProfileAutomatically = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage('Setting up your profile...');
    
    try {
      // Extract first name from Google user data
      let firstName = 'User';
      if (user.user_metadata?.full_name) {
        firstName = user.user_metadata.full_name.split(' ')[0];
      } else if (user.user_metadata?.name) {
        firstName = user.user_metadata.name.split(' ')[0];
      } else if (user.email) {
        firstName = user.email.split('@')[0];
      }

      // Check if this was a business sign-up
      const isBusinessAuth = sessionStorage.getItem('google_business_auth') === 'true';
      sessionStorage.removeItem('google_business_auth');

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          user_id: user.id,
          display_name: firstName,
          avatar_url: user.user_metadata?.avatar_url || null,
          user_type: isBusinessAuth ? 'business' : 'consumer',
          email_notifications: true,
          push_notifications: true,
          notifications_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Create user impact record
      const { error: impactError } = await supabase
        .from('user_impact')
        .insert({
          user_id: user.id,
          total_orders: 0,
          total_savings: 0,
          total_co2_saved: 0,
          total_food_waste_prevented: 0,
          weekly_challenge_progress: 0,
          community_achievements: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (impactError) {
        console.error('Impact creation error:', impactError);
        // Don't fail the whole process for impact creation error
      }

      // If business auth, create business profile
      if (isBusinessAuth) {
        const { error: businessError } = await supabase
          .from('business_profiles')
          .insert({
            user_id: user.id,
            business_name: `${firstName}'s Business`,
            address: 'To be updated',
            location: 'To be updated',
            user_type: 'business',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (businessError) {
          console.error('Business profile creation error:', businessError);
          // Don't fail the whole process for business profile error
        }
      }

      // Refresh user data
      await refreshUserData();

      setStatus('success');
      setMessage(`Welcome to FoodVrse, ${firstName}! Your profile has been created.`);
      
      toast.success(`Welcome ${firstName}! Your account has been set up successfully.`);
      
      setTimeout(() => {
        if (isBusinessAuth) {
          navigate('/business-dashboard');
        } else {
          navigate('/profile');
        }
        onComplete();
      }, 2000);

    } catch (error) {
      console.error('Error creating profile:', error);
      setStatus('error');
      setMessage('Failed to create profile. Please try again.');
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-start justify-center p-4 pt-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your account</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthHandler; 