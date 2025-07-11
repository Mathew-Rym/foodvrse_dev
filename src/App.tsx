
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { BusinessItemsProvider } from "@/contexts/BusinessItemsContext";
import FeedbackFAB from "@/components/FeedbackFAB";
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
import MysteryBoxes from "./pages/MysteryBoxes";
import HowItWorks from "./pages/HowItWorks";
import ImpactTrackerPage from "./pages/ImpactTrackerPage";
import HelpCenter from "./pages/HelpCenter";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import ContactSupport from "./pages/ContactSupport";
import ReportAbuse from "./pages/ReportAbuse";
import ReportSecurity from "./pages/ReportSecurity";
import OurStory from "./pages/OurStory";
import OurImpact from "./pages/OurImpact";
import MeetTheTeam from "./pages/MeetTheTeam";
import Careers from "./pages/Careers";
import Press from "./pages/Press";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
                <Route path="/discover" element={<Discover />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/partner-application" element={<PartnerApplication />} />
                <Route path="/business-dashboard" element={<BusinessDashboard />} />
                <Route path="/food-waste" element={<FoodWaste />} />
                <Route path="/mystery-boxes" element={<MysteryBoxes />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/impact-tracker" element={<ImpactTrackerPage />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/contact-support" element={<ContactSupport />} />
                <Route path="/report-abuse" element={<ReportAbuse />} />
                <Route path="/report-security" element={<ReportSecurity />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/our-impact" element={<OurImpact />} />
                <Route path="/meet-the-team" element={<MeetTheTeam />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FeedbackFAB />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </BusinessItemsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
