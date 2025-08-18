import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your login...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the current session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setMessage('Failed to get session. Please try again.');
          return;
        }

        if (!session?.user) {
          setStatus('error');
          setMessage('No user session found. Please try logging in again.');
          return;
        }

        const user = session.user;
        console.log('OAuth user:', user);

        // Check if user profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingProfile) {
          console.log('Profile already exists:', existingProfile);
          setStatus('success');
          setMessage('Welcome back! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
          return;
        }

        // Create new user profile
        setMessage('Setting up your profile...');
        
        // Extract first name from Google user data
        let firstName = 'User';
        if (user.user_metadata?.full_name) {
          firstName = user.user_metadata.full_name.split(' ')[0];
        } else if (user.user_metadata?.name) {
          firstName = user.user_metadata.name.split(' ')[0];
        } else if (user.email) {
          firstName = user.email.split('@')[0];
        }

        // Check if this is a business auth
        const isBusinessAuth = sessionStorage.getItem('google_business_auth') === 'true';
        sessionStorage.removeItem('google_business_auth');

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
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
          setStatus('error');
          setMessage('Failed to create profile. Please try again.');
          return;
        }

        // Create user impact record
        const { error: impactError } = await supabase
          .from('user_impact')
          .insert({
            id: user.id,
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
              id: user.id,
              business_name: `${firstName}'s Business`,
address: 'Address to be updated',
location: 'Location to be updated',
              user_type: 'business',
              address: 'Address to be updated',
location: 'Location to be updated',
              location: 'Location to be updated',
              status: 'pending',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (businessError) {
            console.error('Business profile creation error:', businessError);
            // Don't fail the whole process for business profile error
          }
        }

        setStatus('success');
        setMessage(`Welcome to FoodVrse, ${firstName}! Your profile has been created.`);
        
        toast.success(`Welcome ${firstName}! Your account has been set up successfully.`);
        
        setTimeout(() => navigate('/'), 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
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
      </div>
    </div>
  );
};

export default OAuthCallback; 