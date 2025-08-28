import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Trash2, Plus, Edit3 } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: string;
  number: string;
  is_default: boolean;
  created_at: string;
}

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentMethodsDialog = ({ open, onOpenChange }: PaymentMethodsDialogProps) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'M-Pesa',
    number: '',
    is_default: false
  });

  const paymentTypes = [
    { value: 'M-Pesa', label: 'M-Pesa' },
    { value: 'Airtel Money', label: 'Airtel Money' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Debit Card', label: 'Debit Card' }
  ];

  useEffect(() => {
    if (open && user) {
      fetchPaymentMethods();
    }
  }, [open, user]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) {
        console.error('Error fetching payment methods:', error);
        return;
      }

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!user || !formData.number.trim()) {
      toast.error('Please enter payment details');
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_payment_methods')
        .insert({
          user_id: user.id,
          type: formData.type,
          number: formData.number.trim(),
          is_default: paymentMethods.length === 0 || formData.is_default
        });

      if (error) {
        toast.error('Failed to add payment method');
        return;
      }

      await fetchPaymentMethods();
      setFormData({ type: 'M-Pesa', number: '', is_default: false });
      setShowAddForm(false);
      toast.success('Payment method added successfully!');
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('id', methodId);

      if (error) {
        toast.error('Failed to delete payment method');
        return;
      }

      await fetchPaymentMethods();
      toast.success('Payment method deleted successfully');
    } catch (error) {
      toast.error('Failed to delete payment method');
    }
  };

  const maskCardNumber = (number: string) => {
    if (number.length <= 4) return number;
    return '*'.repeat(number.length - 4) + number.slice(-4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] bg-white rounded-lg shadow-xl border overflow-hidden flex flex-col">
        <div className="flex-shrink-0 bg-white border-b border-gray-100 rounded-t-lg p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading payment methods...</p>
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Your Payment Methods</h3>
              {paymentMethods.map((method) => (
                <Card key={method.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.type}</span>
                            {method.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{maskCardNumber(method.number)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment methods added yet</p>
            </div>
          )}

          {showAddForm && (
            <Card className="border border-gray-200">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Add Payment Method</h3>
                
                <div>
                  <Label>Payment Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    disabled={isSaving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Account/Card Number</Label>
                  <Input
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="Enter account number"
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    disabled={isSaving}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_default" className="text-sm">
                    Set as default payment method
                  </Label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)} 
                    className="flex-1"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddPaymentMethod} 
                    className="flex-1"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Add"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          )}
        </div>
        
        <div className="flex-shrink-0 bg-white border-t border-gray-100 p-6 pt-4 rounded-b-lg">
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodsDialog;
