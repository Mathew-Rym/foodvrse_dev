
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { BusinessItemsProvider } from "@/contexts/BusinessItemsContext";
import FeedbackFAB from "@/components/FeedbackFAB";
import "@/lib/i18n";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Impact from "./pages/Impact";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import PartnerApplication from "./pages/PartnerApplication";
import BusinessDashboard from "./pages/BusinessDashboard";
import Auth from "./pages/Auth";
import FoodWaste from "./pages/FoodWaste";
import MysteryBags from "./pages/MysteryBoxes";
import HowItWorks from "./pages/HowItWorks";
import ImpactTrackerPage from "./pages/ImpactTrackerPage";
import HelpCenter from "./pages/HelpCenter";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";

import OurStory from "./pages/OurStory";
import OurImpact from "./pages/OurImpact";
import MeetTheTeam from "./pages/MeetTheTeam";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Partners from "./pages/Partners";
import ComingSoon from "./pages/ComingSoon";
import GoogleOAuthHandler from "./components/GoogleOAuthHandler";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => {
  // Check if this is an OAuth callback
  const isOAuthCallback = window.location.search.includes('access_token') || 
                         window.location.search.includes('error');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BusinessItemsProvider>
              <CartProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/oauth-callback" element={
                        <GoogleOAuthHandler onComplete={() => window.history.replaceState({}, '', '/')} />
                      } />
                <Route path="/discover" element={<Discover />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/partner-application" element={<PartnerApplication />} />
                <Route path="/business-dashboard" element={<BusinessDashboard />} />
                <Route path="/food-waste" element={<FoodWaste />} />
                <Route path="/mystery-boxes" element={<MysteryBags />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/impact-tracker" element={<ImpactTrackerPage />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
                <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/our-impact" element={<OurImpact />} />
                <Route path="/meet-the-team" element={<MeetTheTeam />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FeedbackFAB />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </BusinessItemsProvider>
    </AuthProvider>
  </LanguageProvider>
</ThemeProvider>
</QueryClientProvider>
  );
};

export default App;
