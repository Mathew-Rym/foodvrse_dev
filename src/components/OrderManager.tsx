import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  quantity: number;
  total_amount: number;
  original_total: number;
  status: string;
  pickup_code: string;
  notes: string;
  created_at: string;
  collected_at: string;
  mystery_bag: {
    title: string;
    pickup_start_time: string;
    pickup_end_time: string;
    pickup_date: string;
  };
  business_profile: {
    business_name: string;
    location: string;
    address: string;
  };
}

const OrderManager = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          mystery_bag:mystery_bags(title, pickup_start_time, pickup_end_time, pickup_date),
          business_profile:business_profiles(business_name, location, address)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('user-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchOrders(); // Refresh orders when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsCollected = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'collected' })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast({
          title: "Error",
          description: "Failed to mark order as collected",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Order Collected!",
        description: "Your impact metrics have been updated",
        variant: "default"
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'collected': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <Package className="w-4 h-4" />;
      case 'collected': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-600">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{order.mystery_bag?.title}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                <span className="flex items-center space-x-1">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{order.business_profile?.business_name}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{order.business_profile?.address}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Quantity: {order.quantity}</span>
              <span>Total: KSh {order.total_amount}</span>
            </div>
            
            {order.pickup_code && (
              <div className="p-2 bg-blue-50 rounded text-center">
                <p className="text-sm font-medium text-blue-800">Pickup Code: {order.pickup_code}</p>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Pickup: {order.mystery_bag?.pickup_start_time} - {order.mystery_bag?.pickup_end_time}
            </div>
            
            {order.status === 'paid' && (
              <Button 
                onClick={() => markAsCollected(order.id)}
                className="w-full"
                size="sm"
              >
                Mark as Collected
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderManager;