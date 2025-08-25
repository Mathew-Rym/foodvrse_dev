import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { checkIfBusinessPartner } from '@/services/businessPartnerService';
import Logo from '@/components/Logo';

interface AuthFormData {
  email: string;
  password: string;
}

const Auth = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [authStep, setAuthStep] = useState<'main' | 'email'>('main');
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const form = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email');
    if (savedEmail) {
      form.setValue('email', savedEmail);
    }
  }, [form]);

  // Handle successful authentication with business partner detection
  const handleAuthSuccess = async (email: string) => {
    setRedirecting(true);
    
    try {
      // Fast business partner check with timeout
      const businessCheck = await Promise.race([
        checkIfBusinessPartner(email),
        new Promise(resolve => setTimeout(() => resolve({ isBusinessPartner: false }), 300))
      ]);
      
      if ((businessCheck as any).isBusinessPartner) {
        toast.success(`Welcome ${(businessCheck as any).businessName || 'Business Partner'}!`);
        navigate('/business-dashboard', { replace: true });
        setIsOpen(false);
      } else {
        toast.success('Welcome to FoodVrse!');
        navigate('/discover', { replace: true });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error checking business status:', error);
      // Default to discover on error
      toast.success('Welcome to FoodVrse!');
      navigate('/discover', { replace: true });
      setIsOpen(false);
    }
  };

  // Unified authentication handler
  const handleUnifiedAuth = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First try to sign in (user exists)
      const signInResult = await signIn(email, password);
      
      if (!signInResult.error) {
        // User exists and signed in successfully
        await handleAuthSuccess(email);
        return;
      }
      
      // If sign in fails, try to sign up (new user)
      const signUpResult = await signUp(email, password);
      
      if (!signUpResult.error) {
        // New user created successfully
        await handleAuthSuccess(email);
        return;
      }
      
      // Both failed
      toast.error('Authentication failed. Please check your credentials.');
      
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google authentication
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (!result.error) {
        // Get user email from auth context
        const userEmail = form.getValues('email') || 'user@example.com';
        await handleAuthSuccess(userEmail);
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('An error occurred during Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email form submission
  const onSubmit = async (data: AuthFormData) => {
    await handleUnifiedAuth(data.email, data.password);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  const handleEmailContinue = () => {
    setAuthStep('email');
  };

  if (redirecting) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-900 to-green-800 border-none text-white">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Setting up your dashboard...</h2>
            <p className="text-gray-300">Please wait while we redirect you...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-900 to-green-800 border-none text-white">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Logo size="lg" className="w-16 h-16" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white mb-2">
              Welcome to FoodVrse
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Continue to save food and reduce waste
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google Sign-In Button */}
          <Button
            type="button"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-xl font-medium flex items-center justify-center gap-3 shadow-lg"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Connecting to Google...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-green-900 to-green-800 text-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Authentication Form */}
          {authStep === 'email' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Email address" 
                          className="bg-white/20 border-gray-500 text-white placeholder:text-gray-300 rounded-xl py-3 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
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
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password" 
                            className="bg-white/20 border-gray-500 text-white placeholder:text-gray-300 rounded-xl py-3 pr-10 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium shadow-lg border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Continuing...
                    </div>
                  ) : (
                    'Continue with email'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Button 
              onClick={handleEmailContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium shadow-lg border-0"
            >
              Continue with email
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Auth;