import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, ShoppingBag, User } from 'lucide-react';

interface GoogleOAuthHandlerProps {
  onComplete: () => void;
}

const GoogleOAuthHandler: React.FC<GoogleOAuthHandlerProps> = ({ onComplete }) => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: '',
    user_type: 'consumer' as 'consumer' | 'business',
    business_name: ''
  });

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!user) return;

      // Check if user already has a profile
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // User already has a profile, redirect to appropriate dashboard
        if (existingProfile.user_type === 'business') {
          navigate('/business-dashboard');
        } else {
          navigate('/');
        }
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

      if (profileError) throw profileError;

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

      toast.success(`Welcome ${firstName}! Your account has been set up successfully.`);

      // Redirect to appropriate dashboard
      if (isBusinessAuth) {
        navigate('/business-dashboard');
      } else {
        navigate('/');
      }

      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
      // Fallback to manual profile setup
      setShowProfileSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSetup = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          display_name: profileData.display_name,
          user_type: profileData.user_type,
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // If business user, create business profile
      if (profileData.user_type === 'business') {
        const { error: businessError } = await supabase
          .from('business_profiles')
          .insert({
            user_id: user.id,
            business_name: profileData.business_name,
            address: 'Address not provided',
            location: 'Location not provided',
            user_type: 'business',
            created_at: new Date().toISOString()
          });

        if (businessError) throw businessError;
      }

      // Create user impact record
      const { error: impactError } = await supabase
        .from('user_impact')
        .insert({
          user_id: user.id,
          total_meals_saved: 0,
          total_co2_saved_kg: 0,
          total_money_saved_ksh: 0,
          created_at: new Date().toISOString()
        });

      if (impactError) throw impactError;

      // Refresh user data
      await refreshUserData();

      toast.success(
        profileData.user_type === 'business' 
          ? 'Business account created successfully!' 
          : 'Account created successfully!'
      );

      // Redirect to appropriate dashboard
      if (profileData.user_type === 'business') {
        navigate('/business-dashboard');
      } else {
        navigate('/');
      }

      onComplete();
    } catch (error) {
      console.error('Error setting up profile:', error);
      toast.error('Failed to set up profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showProfileSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Setting up your account...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Welcome! Please complete your profile to continue.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="display_name">
                {profileData.user_type === 'business' ? 'Business Name' : 'Full Name'}
              </Label>
              <Input
                id="display_name"
                value={profileData.display_name}
                onChange={(e) => setProfileData({
                  ...profileData,
                  display_name: e.target.value,
                  business_name: profileData.user_type === 'business' ? e.target.value : profileData.business_name
                })}
                placeholder={profileData.user_type === 'business' ? 'Enter business name' : 'Enter your full name'}
              />
            </div>

            {profileData.user_type === 'consumer' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Consumer Account</p>
                  <p className="text-sm text-green-600">Save money on food deals</p>
                </div>
              </div>
            )}

            {profileData.user_type === 'business' && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Business Account</p>
                  <p className="text-sm text-blue-600">List and sell your food items</p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleProfileSetup}
            disabled={isLoading || !profileData.display_name.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up account...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthHandler; 