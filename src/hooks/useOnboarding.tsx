
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('foodvrse-onboarding-complete');
    
    if (!hasSeenOnboarding) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('foodvrse-onboarding-complete', 'true');
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('foodvrse-onboarding-complete', 'true');
    setShowOnboarding(false);
  };

  return {
    isFirstVisit,
    showOnboarding,
    completeOnboarding,
    skipOnboarding
  };
};
