
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
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <LocationNotification />
      <div className={`${isAuthenticated ? "pb-20" : ""} overflow-x-hidden`}> {/* Add overflow-x-hidden to prevent horizontal scroll */}
        <div id="hero-section">
          <HeroSection />
        </div>
        <div id="food-listings">
          <FoodListings />
        </div>
        <div id="mystery-box-section">
          <MysteryBoxSection />
        </div>
        <GameSection />
        <ImpactTracker />
        <Footer />
      </div>
      {isAuthenticated && (
        <div id="mobile-navigation">
          <MobileNavigation />
        </div>
      )}
      <AddOnPopup />
      <OrderCompletePopup />
      <CookieConsent />
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
