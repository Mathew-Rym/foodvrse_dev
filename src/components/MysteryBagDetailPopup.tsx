import { useState } from "react";
import { ArrowLeft, ArrowRight, Share2, Heart, Clock, MapPin, Star, ShoppingBag, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuantitySelector } from "./QuantitySelector";
import { PaymentPopup } from "./PaymentPopup";

interface MysteryBagDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bag: {
    id: number;
    vendor: string;
    title: string;
    price: number;
    originalPrice: number;
    pickup: string;
    items: string;
    location: string;
    address: string;
    website?: string;
    itemsLeft: number;
    rating: number;
    reviewCount: number;
    category: string;
    description: string;
    gradient: string;
  };
}

export const MysteryBagDetailPopup = ({ isOpen, onClose, bag }: MysteryBagDetailPopupProps) => {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showSurprisePopup, setShowSurprisePopup] = useState(false);

  const handleReserveClick = () => {
    setShowQuantitySelector(true);
  };

  const handleQuantityConfirm = (quantity: number) => {
    setSelectedQuantity(quantity);
    setShowQuantitySelector(false);
    setShowPayment(true);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: bag.title,
        text: `Check out this mystery bag from ${bag.vendor}`,
        url: window.location.href,
      });
    }
  };

  const handleItemsLeftClick = () => {
    setShowSurprisePopup(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto p-0 max-h-[90vh] overflow-y-auto" aria-describedby="mystery-bag-details">
          <div className="sr-only" id="mystery-bag-details">
            Mystery bag details for {bag.vendor}
          </div>
          {/* Header with background image */}
          <div className={`relative bg-gradient-to-r ${bag.gradient} h-48 rounded-t-lg`}>
            {/* Navigation and actions */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Items left indicator */}
            <button 
              onClick={handleItemsLeftClick}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              {bag.itemsLeft} left
            </button>

            {/* Store info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{bag.vendor} - {bag.location}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Bag details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{bag.title}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="font-medium">{bag.rating}</span>
                  <span className="text-gray-500 text-sm">({bag.reviewCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Collect: {bag.pickup} Today</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{bag.address}</span>
                <ChevronRight className="w-4 h-4" />
              </div>

              {bag.website && (
                <a href={bag.website} className="text-primary text-sm hover:underline">
                  More information about the store
                </a>
              )}
            </div>

            {/* Price section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                 <div>
                   <span className="text-2xl font-bold text-green-600">KSh {bag.price}</span>
                   <span className="text-gray-500 line-through ml-2">KSh {bag.originalPrice}</span>
                 </div>
              </div>
            </div>

            {/* What you could get */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">WHAT YOU COULD GET</h3>
              <p className="text-gray-700 text-sm">{bag.description}</p>
              <Badge variant="secondary" className="text-xs">
                {bag.category}
              </Badge>
            </div>

            {/* Ingredients & allergens */}
            <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs">🥄</span>
              </div>
              <span className="text-sm">Ingredients & allergens</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Reviews section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">WHAT OTHER PEOPLE ARE SAYING</h3>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                  <span className="text-xl font-bold">{bag.rating} / 5.0</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">TOP 3 HIGHLIGHTS:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">Great value</Badge>
                    <Badge variant="outline" className="text-xs">Friendly staff</Badge>
                    <Badge variant="outline" className="text-xs">Great amount of food</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Reserve button */}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              onClick={handleReserveClick}
            >
              RESERVE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Surprise popup */}
      <Dialog open={showSurprisePopup} onOpenChange={setShowSurprisePopup}>
        <DialogContent className="max-w-sm mx-auto p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Your Mystery Bag is a surprise</h3>
            <p className="text-gray-600 text-sm mb-4">
              We can't predict what will be in your Mystery Bag as it depends on what the store has in surplus.
            </p>
            <p className="text-gray-600 text-sm mb-6">
              If you're concerned about allergens or ingredients please ask the store.
            </p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowSurprisePopup(false)}
            >
              GOT IT!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quantity Selector */}
      {showQuantitySelector && (
        <QuantitySelector
          isOpen={showQuantitySelector}
          onClose={() => setShowQuantitySelector(false)}
          onConfirm={handleQuantityConfirm}
          bag={bag}
        />
      )}

      {/* Payment Popup */}
      {showPayment && (
        <PaymentPopup
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          bag={bag}
          quantity={selectedQuantity}
        />
      )}
    </>
  );
};