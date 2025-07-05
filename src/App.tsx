import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Impact from "./pages/Impact";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PartnerApplication from "./pages/PartnerApplication";
import BusinessDashboard from "./pages/BusinessDashboard";
import Auth from "./pages/Auth";
import FoodWaste from "./pages/FoodWaste";
import MysteryBoxes from "./pages/MysteryBoxes";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
              <Route path="/partner-application" element={<PartnerApplication />} />
              <Route path="/business-dashboard" element={<BusinessDashboard />} />
              <Route path="/food-waste" element={<FoodWaste />} />
              <Route path="/mystery-boxes" element={<MysteryBoxes />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
