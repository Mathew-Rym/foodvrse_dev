import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeMessageProps {
  isFirstTime?: boolean;
}

const WelcomeMessage = ({ isFirstTime = false }: WelcomeMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated, userProfile } = useAuth();

  useEffect(() => {
    if (isFirstTime && !isAuthenticated) {
      // Show welcome message for first-time users (10 seconds)
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime, isAuthenticated]);

  // Separate effect for login events
  useEffect(() => {
    if (isAuthenticated && user && !isFirstTime) {
      // Only show welcome back message on actual login (when auth state changes to authenticated)
      const hasShownWelcome = sessionStorage.getItem('welcome_shown');
      if (!hasShownWelcome) {
        setIsVisible(true);
        sessionStorage.setItem('welcome_shown', 'true');
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 7000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, isFirstTime]);

  if (!isVisible) return null;

  const isWelcomeBack = isAuthenticated && user;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-2xl p-6 max-w-sm mx-auto shadow-2xl animate-scale-in">
        <div className="text-center">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4">
            {isWelcomeBack ? (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome back, {userProfile?.display_name || user?.email}!
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Discover today's mystery bag and be a food waste champion.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to FoodVrse!
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Discover surplus food (Mystery bags) from local restaurants and stores. Help reduce food waste while enjoying delicious meals at up to 70% off.
                </p>
                <p className="text-brand-green font-medium">
                  <Sparkles className="inline w-4 h-4 mr-1" />
                Tap to explore. Swipe to save. Your next zero-waste meal awaits!
                </p>
              </>
            )}
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {isWelcomeBack ? "Explore Today's Offers" : "Let's Get Started!"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;