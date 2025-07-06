
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building, ShoppingBag } from 'lucide-react';
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
  const { login, signup } = useAuth();
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
      if (isSignUp) {
        await signup(data.email, data.password, data.name || '');
      } else {
        await login(data.email, data.password);
      }
      
      // Redirect based on auth type
      if (isBusinessAuth) {
        navigate('/business-dashboard');
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = () => {
    // Mock Google sign-in
    toast.success('Google Sign-In coming soon!');
    console.log('Google sign-in clicked', isBusinessAuth ? 'for business' : 'for consumer');
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
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
              {isBusinessAuth ? 'Business Sign In' : (isSignUp ? 'Create Account' : 'Sign In')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isBusinessAuth 
              ? 'Access your business dashboard and manage your listings'
              : (isSignUp 
                ? 'Join FoodVrse to start saving food and money' 
                : 'Welcome back to FoodVrse'
              )
            }
          </DialogDescription>
        </DialogHeader>

        {/* Account Type Selection - Only show when not in business mode */}
        {!isBusinessAuth && (
          <div className="space-y-3 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Choose your account type:</p>
            </div>
            
            {/* Consumer Option */}
            <div className="p-3 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Save Money</h3>
                  <p className="text-xs text-green-600">Click here to buy discounted food</p>
                </div>
              </div>
            </div>

            {/* Business Option */}
            <Button
              variant="outline"
              className="w-full p-4 h-auto flex items-start gap-3 border-orange-200 bg-orange-50 hover:bg-orange-100"
              onClick={() => setIsBusinessAuth(true)}
            >
              <Building className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-left">
                <div className="font-medium text-orange-800">Business/Sell</div>
                <div className="text-xs text-orange-600">Click here to list your food items</div>
              </div>
            </Button>
          </div>
        )}

        {/* Business Mode - Show switch back option */}
        {isBusinessAuth && (
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => setIsBusinessAuth(false)}
            >
              <ShoppingBag className="w-4 h-4" />
              Switch to Consumer Login
            </Button>
          </div>
        )}

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
              {isSignUp && (
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
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                {isBusinessAuth 
                  ? 'Access Business Dashboard'
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>
            </form>
          </Form>
        </div>

        {!isBusinessAuth && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Auth;
