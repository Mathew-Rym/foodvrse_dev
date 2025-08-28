import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { BusinessItemsProvider } from "@/contexts/BusinessItemsContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import FeedbackFAB from "@/components/FeedbackFAB";
import "@/lib/i18n";
import { lazy, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Discover = lazy(() => import("./pages/Discover"));
const Cart = lazy(() => import("./pages/Cart"));
const Orders = lazy(() => import("./pages/Orders"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BusinessDashboard = lazy(() => import("./pages/BusinessDashboard"));
const Auth = lazy(() => import("./pages/Auth"));

const FoodWaste = lazy(() => import("./pages/FoodWaste"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const SafetyGuidelines = lazy(() => import("./pages/SafetyGuidelines"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const OurStory = lazy(() => import("./pages/OurStory"));
const OurImpact = lazy(() => import("./pages/OurImpact"));
const MeetTheTeam = lazy(() => import("./pages/MeetTheTeam"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const ESG = lazy(() => import("./pages/ESG"));
const Partners = lazy(() => import("./pages/Partners"));
const PartnerApplication = lazy(() => import("./pages/PartnerApplication"));
const PendingApproval = lazy(() => import("./pages/PendingApproval"));
const ApplicationRejected = lazy(() => import("./pages/ApplicationRejected"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const GamificationPage = lazy(() => import("./pages/GamificationPage"));
const ImpactTrackerPage = lazy(() => import("./pages/ImpactTrackerPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const GoogleOAuthHandler = lazy(() => import("./components/GoogleOAuthHandler"));


// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <p>Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3D6C56',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple test component
const TestComponent = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>FoodVrse Test Page</h1>
    <p>If you can see this, the basic React app is working!</p>
  </div>
);

const App = () => {
  // Check if this is an OAuth callback
  const isOAuthCallback = window.location.search.includes('access_token') || 
                         window.location.search.includes('error');

  // Debug logging for Safari
  if (typeof window !== 'undefined') {
    console.log('App loading...', {
      userAgent: navigator.userAgent,
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent)
    });
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <FavoritesProvider>
                  <BusinessItemsProvider>
                    <CartProvider>
                      <TooltipProvider>
                        <BrowserRouter>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                              {/* Test route */}
                              <Route path="/test" element={<TestComponent />} />
                              
                              {/* OAuth callback route */}
                              {isOAuthCallback && (
                                <Route path="/" element={<GoogleOAuthHandler />} />
                              )}
                              
                              {/* Main routes */}
                              <Route path="/" element={<Index />} />
                              <Route path="/discover" element={<Discover />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/orders" element={<Orders />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/favorites" element={<Favorites />} />
                              <Route path="/auth" element={<Auth />} />
                              <Route path="/business-dashboard" element={<BusinessDashboard />} />
                              
                              <Route path="/food-waste" element={<FoodWaste />} />
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
                              <Route path="/esg" element={<ESG />} />
                              <Route path="/partners" element={<Partners />} />
                              <Route path="/partner-application" element={<PartnerApplication />} />
                              <Route path="/pending-approval" element={<PendingApproval />} />
                              <Route path="/application-rejected" element={<ApplicationRejected />} />
                              <Route path="/coming-soon" element={<ComingSoon />} />
                              <Route path="/category/:categoryName" element={<CategoryPage />} />
                              <Route path="/gamification" element={<GamificationPage />} />
                              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                          <FeedbackFAB />
                        </BrowserRouter>
                      </TooltipProvider>
                    </CartProvider>
                  </BusinessItemsProvider>
                </FavoritesProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
      <Toaster />
      <Sonner />
    </ErrorBoundary>
  );
};

export default App;
