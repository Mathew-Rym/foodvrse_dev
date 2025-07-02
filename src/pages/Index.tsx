
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FoodListings from "@/components/FoodListings";
import MysteryBoxSection from "@/components/MysteryBoxSection";
import GameSection from "@/components/GameSection";
import ImpactTracker from "@/components/ImpactTracker";
import Footer from "@/components/Footer";
import MobileNavigation from "@/components/MobileNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pb-20"> {/* Add bottom padding for mobile navigation */}
        <HeroSection />
        <FoodListings />
        <MysteryBoxSection />
        <GameSection />
        <ImpactTracker />
        <Footer />
      </div>
      <MobileNavigation />
    </div>
  );
};

export default Index;
