import { useState } from "react";
import { CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bag: {
    vendor: string;
    title: string;
    price: number;
    pickup: string;
    location: string;
  };
  quantity: number;
}

export const PaymentPopup = ({ isOpen, onClose, bag, quantity }: PaymentPopupProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'airtel' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const { toast } = useToast();

  const totalAmount = bag.price * quantity;

  const validatePhoneNumber = (phone: string): boolean => {
    // Kenyan phone number validation (254xxxxxxxxx or 07xxxxxxxx format)
    const phoneRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateCardNumber = (number: string): boolean => {
    // Basic Luhn algorithm for card validation
    const cleanNumber = number.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let isEven = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiry: string): boolean => {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;
    const now = new Date();
    const expiryDate = new Date(year, month - 1);
    
    return month >= 1 && month <= 12 && expiryDate > now;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>\"'&]/g, '').trim();
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'mpesa' || paymentMethod === 'airtel') {
      const cleanPhone = sanitizeInput(phoneNumber);
      
      if (!cleanPhone) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
          variant: "destructive"
        });
        return;
      }

      if (!validatePhoneNumber(cleanPhone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Kenyan phone number (e.g., 0712345678)",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate STK push
      toast({
        title: "Payment Request Sent",
        description: `Please check your phone for the ${paymentMethod.toUpperCase()} payment prompt`,
      });
      
      // Simulate payment success after 3 seconds
      setTimeout(() => {
        toast({
          title: "Payment Successful!",
          description: `Your ${bag.title} has been reserved. Please collect between ${bag.pickup}`,
        });
        onClose();
      }, 3000);
    } else if (paymentMethod === 'card') {
      const cleanCardNumber = sanitizeInput(cardDetails.number);
      const cleanExpiry = sanitizeInput(cardDetails.expiry);
      const cleanCVV = sanitizeInput(cardDetails.cvv);
      const cleanName = sanitizeInput(cardDetails.name);

      if (!cleanCardNumber || !cleanExpiry || !cleanCVV || !cleanName) {
        toast({
          title: "Card Details Required",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }

      if (!validateCardNumber(cleanCardNumber)) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid card number",
          variant: "destructive"
        });
        return;
      }

      if (!validateExpiryDate(cleanExpiry)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY) in the future",
          variant: "destructive"
        });
        return;
      }

      if (!validateCVV(cleanCVV)) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3 or 4 digit CVV",
          variant: "destructive"
        });
        return;
      }

      if (cleanName.length < 2) {
        toast({
          title: "Invalid Cardholder Name",
          description: "Please enter the full name on the card",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Payment Successful!",
        description: `Your ${bag.title} has been reserved. Please collect between ${bag.pickup}`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-bold text-lg">{bag.vendor} - {bag.location}</h2>
          <p className="text-gray-600 text-sm mt-1">Today: {bag.pickup}</p>
          <p className="font-bold text-lg mt-2">Total: KSh {totalAmount.toLocaleString()}</p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="font-medium text-center">Select Payment Method</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard className="w-6 h-6 mb-2" />
              <span className="text-xs">Card</span>
            </Button>
            
            <Button
              variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => setPaymentMethod('mpesa')}
            >
              <Smartphone className="w-6 h-6 mb-2" />
              <span className="text-xs">M-Pesa</span>
            </Button>
            
            <Button
              variant={paymentMethod === 'airtel' ? 'default' : 'outline'}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => setPaymentMethod('airtel')}
            >
              <Smartphone className="w-6 h-6 mb-2" />
              <span className="text-xs">Airtel</span>
            </Button>
          </div>

          {/* Payment Forms */}
          {(paymentMethod === 'mpesa' || paymentMethod === 'airtel') && (
            <div className="space-y-3">
              <Input
                placeholder={`Enter ${paymentMethod.toUpperCase()} number`}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <Input
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
                <Input
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                />
              </div>
              <Input
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
          )}

          {/* Pay button */}
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            onClick={handlePayment}
          >
            {paymentMethod === 'card' ? 'PAY NOW' : 'SEND PAYMENT REQUEST'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};