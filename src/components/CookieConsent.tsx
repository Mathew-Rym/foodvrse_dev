
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

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
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
      <Card className="bg-white shadow-lg border border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">
                We use cookies to enhance your experience and analyze site usage. By clicking 'Accept', you consent to our use of cookies. 
                <a href="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline ml-1">
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
