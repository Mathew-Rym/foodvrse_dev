
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FoodListings from "@/components/FoodListings";
import MysteryBoxSection from "@/components/MysteryBoxSection";
import ImpactTracker from "@/components/ImpactTracker";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FoodListings />
      <MysteryBoxSection />
      <ImpactTracker />
      <Footer />
    </div>
  );
};

export default Index;
