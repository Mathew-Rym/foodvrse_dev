
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const consent = localStorage.getItem('foodvrse-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('foodvrse-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('foodvrse-cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed left-0 right-0 z-40 p-4 ${isAuthenticated ? 'bottom-20' : 'bottom-0'}`}>
              <Card className="bg-card shadow-lg border border-brand-green">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">
                We use cookies to enhance your experience and analyze site usage. By clicking 'Accept', you consent to our use of cookies. 
                <a href="/privacy-policy" className="text-brand-green hover:text-brand-green/80 underline ml-1">
                  Learn more in our Privacy Policy
                </a>
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAccept}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  size="sm"
                >
                  Accept
                </Button>
                <Button 
                  onClick={handleDecline}
                  variant="outline"
                  size="sm"
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
