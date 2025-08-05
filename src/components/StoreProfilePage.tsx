import { useState } from "react";
import { ArrowLeft, MapPin, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface StoreProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  store: {
    id: string;
    name: string;
    location: string;
    distance: string;
    address: string;
    website?: string;
    yearsActive: number;
    mealsWasted: number;
    currentOffers: Array<{
      id: string;
      title: string;
      pickup: string;
      price: number;
      itemsLeft: number;
      rating?: number;
    }>;
    pastOffers: Array<{
      id: string;
      title: string;
      price: number;
    }>;
  };
}

export const StoreProfilePage = ({ isOpen, onClose, store }: StoreProfilePageProps) => {
  const handleMapClick = () => {
    // Open Google Maps with store location
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleWebsiteClick = () => {
    if (store.website) {
      window.open(store.website, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Store Profile - {store.name}</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg">🏪</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{store.name} - {store.location}</h2>
              <p className="text-sm text-gray-500">{store.distance}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Business Address */}
          <div className="space-y-2">
            <p className="text-gray-700">{store.address}</p>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 p-0 h-auto"
              onClick={handleMapClick}
            >
              Click to open map
            </Button>
          </div>

          {/* Current Mystery Bags */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">MYSTERY BAGS FROM THIS STORE</h3>
            {store.currentOffers.length > 0 ? (
              <div className="space-y-2">
                {store.currentOffers.map((offer) => (
                  <div key={offer.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{offer.title}</h4>
                        <p className="text-sm text-gray-600">{offer.pickup}</p>
                        <p className="text-lg font-bold text-green-600 mt-1">KSh {offer.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {offer.itemsLeft}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No mystery bags available right now</p>
            )}
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">ABOUT</h3>
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-brand-light-green rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-green">{store.yearsActive}</span>
                </div>
                <p className="text-xs text-gray-600">Fighting food waste</p>
              </div>
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">{store.mealsWasted}+</span>
                </div>
                <p className="text-xs text-gray-600">Meals saved</p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer" onClick={handleMapClick}>
              <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                <p className="text-sm text-gray-600">View on map</p>
              </div>
            </div>
          </div>

          {/* More Info */}
          {store.website && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">MORE INFO</h3>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 p-0 h-auto gap-1"
                onClick={handleWebsiteClick}
              >
                Visit website
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Past Offers */}
          {store.pastOffers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">PAST OFFERS</h3>
              <div className="space-y-2">
                {store.pastOffers.map((offer) => (
                  <div key={offer.id} className="bg-gray-50 rounded-lg p-3 opacity-60">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">{offer.title}</h4>
                        <p className="text-sm text-gray-500">Not available now</p>
                      </div>
                      <p className="text-gray-500">KSh {offer.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};