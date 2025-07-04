
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface MobileMoneyFormData {
  phoneNumber: string;
}

interface MobileMoneyCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMoneyCheckout = ({ isOpen, onClose }: MobileMoneyCheckoutProps) => {
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const { totalPrice, clearCart } = useCart();
  
  const form = useForm<MobileMoneyFormData>({
    defaultValues: {
      phoneNumber: ''
    }
  });

  const onSubmit = async (data: MobileMoneyFormData) => {
    console.log('Initiating STK Push for:', data.phoneNumber);
    setPaymentStep('processing');
    
    // Simulate STK Push process
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        clearCart();
        onClose();
        setPaymentStep('form');
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    if (paymentStep !== 'processing') {
      onClose();
      setPaymentStep('form');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile Money Payment
          </DialogTitle>
          <DialogDescription>
            {paymentStep === 'form' && 'Enter your phone number to receive STK push'}
            {paymentStep === 'processing' && 'Check your phone for payment prompt'}
            {paymentStep === 'success' && 'Payment successful!'}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'form' && (
          <>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm">
                <span>Total Amount:</span>
                <span className="font-bold">KSh {totalPrice}</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+254|0)[17]\d{8}$/,
                      message: 'Please enter a valid Kenyan phone number'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0712345678 or +254712345678" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
                  >
                    Pay KSh {totalPrice}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-lg font-medium mb-2">Processing Payment...</p>
            <p className="text-sm text-gray-600">
              Please check your phone for the M-Pesa prompt and enter your PIN
            </p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium mb-2">Payment Successful!</p>
            <p className="text-sm text-gray-600">
              Your order has been confirmed. You'll receive pickup details shortly.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MobileMoneyCheckout;
