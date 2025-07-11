
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building, ShoppingBag, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isBusinessAuth, setIsBusinessAuth] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showTermsConsent, setShowTermsConsent] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [showLocationRequest, setShowLocationRequest] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { loginConsumer, loginBusiness, signupConsumer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const form = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isBusinessAuth) {
        // Business authentication (login only)
        try {
          await loginBusiness(data.email, data.password);
          navigate('/business-dashboard');
        } catch (error) {
          // If business login fails, redirect to partner application
          toast.error('Business account not found. Please apply to become a partner first.');
          navigate('/partner-application');
        }
      } else {
        // Consumer authentication
        if (isSignUp) {
          await signupConsumer(data.email, data.password, data.name || '');
          setShowEmailSignup(true);
        } else {
          await loginConsumer(data.email, data.password);
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    if (!isBusinessAuth && isSignUp) {
      setShowTermsConsent(true);
    } else {
      toast.success('Google Sign-In coming soon!');
      console.log('Google sign-in clicked', isBusinessAuth ? 'for business' : 'for consumer');
    }
  };

  const handleFacebookSignIn = () => {
    if (!isBusinessAuth && isSignUp) {
      setShowTermsConsent(true);
    } else {
      toast.success('Facebook Sign-In coming soon!');
      console.log('Facebook sign-in clicked for consumer');
    }
  };

  const handleTermsConsent = () => {
    if (termsAccepted && privacyAccepted) {
      setShowTermsConsent(false);
      // Continue with signup process
      toast.success('Terms accepted! Please complete your signup.');
    } else {
      toast.error('Please accept both terms and privacy policy to continue.');
    }
  };

  const handleEmailSignupContinue = (subscribeToEmails: boolean) => {
    if (subscribeToEmails) {
      // Store email for marketing purposes
      console.log('User subscribed to emails');
    }
    setShowEmailSignup(false);
    setShowLocationRequest(true);
  };

  const handleLocationRequest = (allowLocation: boolean) => {
    if (allowLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location accessed:', position.coords);
          toast.success('Location access granted!');
        },
        (error) => {
          console.log('Location access denied:', error);
          toast.info('Location access was denied, but you can still use the app.');
        }
      );
    }
    setShowLocationRequest(false);
    const from = location.state?.from?.pathname || '/';
    navigate(from);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  const resetForm = () => {
    form.reset();
    setIsSignUp(false);
  };

  const handleAuthTypeSwitch = (toBusiness: boolean) => {
    setIsBusinessAuth(toBusiness);
    resetForm();
  };

  const handleBecomePartner = () => {
    navigate('/partner-application');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle>
              {isBusinessAuth ? 'Business Login' : 'Consumer Account'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isBusinessAuth 
              ? 'Business login to manage your restaurant listings'
              : (isSignUp 
                ? 'Create a consumer account to buy discounted food' 
                : 'Consumer login to access your orders and save money'
              )
            }
          </DialogDescription>
        </DialogHeader>

        {/* Account Type Selection */}
        <div className="space-y-3 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Choose your account type:</p>
          </div>
          
          {/* Consumer Option */}
          <Button
            variant={!isBusinessAuth ? "default" : "outline"}
            className={`w-full p-4 h-auto flex items-start gap-3 ${
              !isBusinessAuth 
                ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                : 'border-green-200 bg-green-50 hover:bg-green-100'
            }`}
            onClick={() => handleAuthTypeSwitch(false)}
          >
            <ShoppingBag className={`w-5 h-5 mt-0.5 ${!isBusinessAuth ? 'text-white' : 'text-green-600'}`} />
            <div className="text-left">
              <div className={`font-medium ${!isBusinessAuth ? 'text-white' : 'text-green-800'}`}>Save Money</div>
              <div className={`text-xs ${!isBusinessAuth ? 'text-green-100' : 'text-green-600'}`}>Click here to buy discounted food</div>
            </div>
          </Button>

          {/* Business Option */}
          <Button
            variant={isBusinessAuth ? "default" : "outline"}
            className={`w-full p-4 h-auto flex items-start gap-3 ${
              isBusinessAuth 
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                : 'border-orange-200 bg-orange-50 hover:bg-orange-100'
            }`}
            onClick={() => handleAuthTypeSwitch(true)}
          >
            <Building className={`w-5 h-5 mt-0.5 ${isBusinessAuth ? 'text-white' : 'text-orange-600'}`} />
            <div className="text-left">
              <div className={`font-medium ${isBusinessAuth ? 'text-white' : 'text-orange-800'}`}>Business/Sell</div>
              <div className={`text-xs ${isBusinessAuth ? 'text-orange-100' : 'text-orange-600'}`}>Click here to list your food items</div>
            </div>
          </Button>
        </div>

        <div className="space-y-4">
          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Facebook Sign-In Button - Only for consumers */}
          {!isBusinessAuth && (
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleFacebookSignIn}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Only show name field for consumer signup */}
              {isSignUp && !isBusinessAuth && (
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                rules={{ 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className={`w-full text-white ${
                  isBusinessAuth 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}
              >
                {isBusinessAuth 
                  ? 'Sign In as Business'
                  : (isSignUp ? 'Create Consumer Account' : 'Sign In as Consumer')
                }
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-center">
          {isBusinessAuth ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Don't have a business account?
              </p>
              <Button
                variant="outline"
                onClick={handleBecomePartner}
                className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                Become a Partner
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
              {/* Terms and Privacy Policy Links for Signup */}
              {isSignUp && (
                <div className="text-xs text-gray-500 mt-2">
                  By creating your account, you agree to the{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/terms-of-service')}
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-policy')}
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    Privacy Policy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Terms Consent Modal */}
      <Dialog open={showTermsConsent} onOpenChange={setShowTermsConsent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Terms & Privacy Consent</DialogTitle>
            <DialogDescription>
              Please review and accept our terms to continue
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy-consent"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="privacy-consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I allow FoodVrse to store my email address and name according to our{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-policy')}
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    privacy policy
                  </button>
                </label>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-consent"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms-consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree with the{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/terms-of-service')}
                    className="text-green-600 hover:text-green-700 underline font-bold"
                  >
                    terms & conditions
                  </button>{' '}
                  and the{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-policy')}
                    className="text-green-600 hover:text-green-700 underline font-bold"
                  >
                    privacy policy
                  </button>
                </label>
              </div>
            </div>

            <Button 
              onClick={handleTermsConsent}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!termsAccepted || !privacyAccepted}
            >
              CONTINUE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Signup Modal */}
      <Dialog open={showEmailSignup} onOpenChange={setShowEmailSignup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🥟</span>
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Be the first to know
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Unlock new stores and amazing deals first! Get smart tips to maximize your savings, 
              dive into inspiring impact stories, and even enjoy the odd food pun. Sign up now to 
              get it all delivered straight to your inbox and start your rescue journey!
              <br />
              <span className="text-xs text-gray-400">(We promise you'll only get emails that matter)</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleEmailSignupContinue(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              YES, PLEASE
            </Button>
            <Button 
              variant="ghost"
              onClick={() => handleEmailSignupContinue(false)}
              className="w-full text-gray-600"
            >
              MAYBE LATER
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Request Modal */}
      <Dialog open={showLocationRequest} onOpenChange={setShowLocationRequest}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Enable Location
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Allow FoodVrse to access your location to find the best deals near you and 
              help you discover amazing food offers in your area.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleLocationRequest(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Allow Location Access
            </Button>
            <Button 
              variant="ghost"
              onClick={() => handleLocationRequest(false)}
              className="w-full text-gray-600"
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default Auth;
