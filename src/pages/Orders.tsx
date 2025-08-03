
import { Clock, MapPin, Receipt, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";

const Orders = () => {
  const { orders, updateOrderStatus } = useCart();
  const [showPastOrders, setShowPastOrders] = useState(false);

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const pastOrders = orders.filter(order => order.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-100 text-green-600";
      case "preparing": return "bg-yellow-100 text-yellow-600";  
      case "completed": return "bg-purple-100 text-purple-600";
              default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready": return "Ready for Collection";
      case "preparing": return "Collect";
      case "completed": return "Saving Champion";
      default: return status;
    }
  };

  const handleCollectOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    toast.success('Order collected! You\'re a saving champion! 🏆');
  };

  const handleOrderAgain = (order: any) => {
    toast.success('Added to cart! Complete your order to save more food.');
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track your food rescue orders</p>
        </div>

        {/* Active Orders */}
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Active Orders</h2>
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-lg shadow-sm border border-border">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {order.items.map(item => item.title).join(', ')}
                    </h3>
                    <p className="text-sm text-muted-foreground">{order.restaurant}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{order.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    <span>Order #{order.id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="font-semibold text-foreground">KSh {order.total}</span>
                  {order.status === "ready" && (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      onClick={() => handleCollectOrder(order.id)}
                    >
                      Collect Order
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      onClick={() => handleCollectOrder(order.id)}
                    >
                      Collect Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Past Orders Section */}
          {pastOrders.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Saves</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPastOrders(!showPastOrders)}
                  className="text-brand-green"
                >
                  {showPastOrders ? 'Hide' : 'View All Past Orders'}
                </Button>
              </div>

              {!showPastOrders ? (
                // Show only the most recent completed order
                <div className="bg-card rounded-lg shadow-sm border border-border">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {pastOrders[0].items.map(item => item.title).join(', ')}
                        </h3>
                        <p className="text-sm text-muted-foreground">{pastOrders[0].restaurant}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-600 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Saving Champion
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        <span>Order #{pastOrders[0].id}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <span className="font-semibold text-foreground">KSh {pastOrders[0].total}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOrderAgain(pastOrders[0])}
                      >
                        Order Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Show all past orders
                <div className="space-y-3">
                  {pastOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {order.items.map(item => item.title).join(', ')}
                            </h3>
                            <p className="text-sm text-gray-600">{order.restaurant}</p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-600 flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Saving Champion
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            <span>Order #{order.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="font-semibold text-gray-900">KSh {order.total}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOrderAgain(order)}
                          >
                            Order Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty State for no orders */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Receipt className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
        <p className="text-muted-foreground text-center">Start saving food and your orders will appear here</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Orders;
