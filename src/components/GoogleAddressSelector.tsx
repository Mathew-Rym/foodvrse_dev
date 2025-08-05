import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MapPin } from "lucide-react";

interface GoogleAddressSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect?: (address: string, lat: number, lng: number) => void;
  title?: string;
  description?: string;
}

const GoogleAddressSelector: React.FC<GoogleAddressSelectorProps> = ({
  isOpen,
  onClose,
  onAddressSelect,
  title = "Select Address",
  description = "Use Google's address selection tool for precise location picking"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <CardTitle>{title}</CardTitle>
            </div>
            <Button variant="ghost" onClick={onClose} size="sm">
              ✕
            </Button>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <div className="h-full">
            <iframe 
              src="https://storage.googleapis.com/maps-solutions-pafyahvhtl/address-selection/1zko/address-selection.html"
              width="100%" 
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Google Address Selection"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAddressSelector; 