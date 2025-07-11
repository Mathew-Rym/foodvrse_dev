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
      if (!phoneNumber) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
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
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast({
          title: "Card Details Required",
          description: "Please fill in all card details",
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