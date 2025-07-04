
import { Clock, MapPin, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/MobileLayout";
import { useCart } from "@/contexts/CartContext";

const Orders = () => {
  const { orders } = useCart();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-100 text-green-600";
      case "preparing": return "bg-yellow-100 text-yellow-600";
      case "completed": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track your food rescue orders</p>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {order.items.map(item => item.title).join(', ')}
                    </h3>
                    <p className="text-sm text-gray-600">{order.restaurant}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{order.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    <span>Order #{order.id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">KSh {order.total}</span>
                  {order.status === "ready" && (
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Ready for Pickup
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                  )}
                  {order.status === "completed" && (
                    <Button variant="outline" size="sm">
                      Order Again
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for no orders */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 text-center">Start saving food and your orders will appear here</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Orders;
