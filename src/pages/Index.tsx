
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import MysteryBoxSection from "@/components/MysteryBoxSection";
import GameSection from "@/components/GameSection";
import ImpactTracker from "@/components/ImpactTracker";
import Footer from "@/components/Footer";

import AddOnPopup from "@/components/AddOnPopup";
import OrderCompletePopup from "@/components/OrderCompletePopup";
import LocationNotification from "@/components/LocationNotification";
import OnboardingTour from "@/components/OnboardingTour";
import CookieConsent from "@/components/CookieConsent";
import WelcomeMessage from "@/components/WelcomeMessage";
import BackToTop from "@/components/BackToTop";
import FeedbackFAB from "@/components/FeedbackFAB";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { isFirstVisit, showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-brand-light-green text-foreground overflow-x-hidden">
      <WelcomeMessage isFirstTime={isFirstVisit} />
      <Header />
      <LocationNotification />
      <div className="overflow-x-hidden"> {/* Add overflow-x-hidden to prevent horizontal scroll */}
        <div id="hero-section">
          <HeroSection />
        </div>
        <div id="mystery-box-section">
          <MysteryBoxSection />
        </div>
        <div id="game-section">
          {/* <GameSection /> */}
        </div>
        <div id="partner-section">
          <ImpactTracker />
        </div>
        <Footer />
      </div>
      {/* Mobile navigation removed from landing page - only shows on authenticated pages */}
      <AddOnPopup />
      <OrderCompletePopup />
      <CookieConsent />
      <BackToTop />
      <FeedbackFAB />
      {showOnboarding && (
        <OnboardingTour 
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </div>
  );
};

export default Index;
