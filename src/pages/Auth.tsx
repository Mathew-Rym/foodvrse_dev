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
  businessName?: string;
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
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const form = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      businessName: ''
    }
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isSignUp) {
        // Sign up flow
        const userData = isBusinessAuth 
          ? { display_name: data.businessName, is_business: true }
          : { display_name: data.name };

        const { error } = await signUp(data.email, data.password, userData);
        if (!error) {
          if (!isBusinessAuth) {
            setShowEmailSignup(true);
          } else {
            toast.success('Business account created! Please check your email to confirm.');
            navigate('/business-dashboard');
          }
        }
      } else {
        // Sign in flow
        const { error } = await signIn(data.email, data.password);
        if (!error) {
          // Check for stored redirect path
          const redirectPath = sessionStorage.getItem('redirectAfterAuth');
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterAuth');
            navigate(redirectPath);
          } else {
            const from = location.state?.from?.pathname || '/';
            navigate(from);
          }
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
    }
  };

  const handleFacebookSignIn = () => {
    if (!isBusinessAuth && isSignUp) {
      setShowTermsConsent(true);
    } else {
      toast.success('Facebook Sign-In coming soon!');
    }
  };

  const handleTermsConsent = () => {
    if (termsAccepted && privacyAccepted) {
      setShowTermsConsent(false);
      toast.success('Terms accepted! Please complete your signup.');
    } else {
      toast.error('Please accept both terms and privacy policy to continue.');
    }
  };

  const handleEmailSignupContinue = (subscribeToEmails: boolean) => {
    if (subscribeToEmails) {
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
    const redirectPath = sessionStorage.getItem('redirectAfterAuth');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterAuth');
      navigate(redirectPath);
    } else {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
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
              {isBusinessAuth ? 'Business Account' : 'Consumer Account'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isBusinessAuth 
              ? (isSignUp ? 'Create a business account to manage your restaurant' : 'Business login to manage your listings')
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
              {/* Name field for signup */}
              {isSignUp && (
                <FormField
                  control={form.control}
                  name={isBusinessAuth ? "businessName" : "name"}
                  rules={{ required: `${isBusinessAuth ? 'Business name' : 'Name'} is required` }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isBusinessAuth ? 'Business Name' : 'Full Name'}</FormLabel>
                      <FormControl>
                        <Input placeholder={isBusinessAuth ? 'Enter your business name' : 'Enter your full name'} {...field} />
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
                  ? (isSignUp ? 'Create Business Account' : 'Sign In as Business')
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
                {isSignUp ? 'Already have a business account?' : "Don't have a business account?"}
              </p>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
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
                    onClick={() => navigate('/terms-of-service', { state: { hideNavbar: true } })}
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-policy', { state: { hideNavbar: true } })}
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

      {/* Email Signup Continue Dialog */}
      <Dialog open={showEmailSignup} onOpenChange={setShowEmailSignup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Almost there!</DialogTitle>
            <DialogDescription>
              Would you like to receive updates about new deals and restaurants?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              onClick={() => handleEmailSignupContinue(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Yes, keep me updated!
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleEmailSignupContinue(false)}
              className="w-full"
            >
              No thanks, just continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Request Dialog */}
      <Dialog open={showLocationRequest} onOpenChange={setShowLocationRequest}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Location Services</DialogTitle>
            <DialogDescription>
              Help us find the best food deals near you!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto text-orange-500 mb-2" />
              <p className="text-sm text-gray-600">
                We'll use your location to show nearby restaurants and calculate accurate pickup times.
              </p>
            </div>
            <Button 
              onClick={() => handleLocationRequest(true)}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Allow Location Access
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleLocationRequest(false)}
              className="w-full"
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