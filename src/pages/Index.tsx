import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FoodListings from "@/components/FoodListings";
import MysteryBoxSection from "@/components/MysteryBoxSection";
import GameSection from "@/components/GameSection";
import ImpactTracker from "@/components/ImpactTracker";
import Footer from "@/components/Footer";
import MobileNavigation from "@/components/MobileNavigation";
import AddOnPopup from "@/components/AddOnPopup";
import OrderCompletePopup from "@/components/OrderCompletePopup";
import LocationNotification from "@/components/LocationNotification";
import OnboardingTour from "@/components/OnboardingTour";
import CookieConsent from "@/components/CookieConsent";
import FeedbackFAB from "@/components/FeedbackFAB";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LocationNotification />
      <div className={isAuthenticated ? "pb-20" : ""}> {/* Add bottom padding only if authenticated for mobile navigation */}
        <HeroSection />
        <FoodListings />
        <MysteryBoxSection />
        <GameSection />
        <ImpactTracker />
        <Footer />
      </div>
      {isAuthenticated && <MobileNavigation />}
      <AddOnPopup />
      <OrderCompletePopup />
      <CookieConsent />
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
