
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Plus,
  Edit,
  Eye,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState([
    {
      id: 1,
      name: "Mixed Pastries Box",
      originalPrice: 800,
      discountPrice: 400,
      quantity: 5,
      pickupTime: "4:00 PM - 6:00 PM",
      status: "active"
    },
    {
      id: 2,
      name: "Fresh Salad Bundle",
      originalPrice: 600,
      discountPrice: 300,
      quantity: 3,
      pickupTime: "5:00 PM - 7:00 PM",
      status: "low_stock"
    }
  ]);

  const stats = {
    totalSales: 45600,
    itemsSold: 234,
    co2Saved: 167,
    avgRating: 4.7
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Business Dashboard</h1>
              <p className="text-white/90 text-sm">Mama's Kitchen</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white">Active Partner</Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Total Sales</span>
            </div>
            <p className="text-xl font-bold text-gray-900">KSh {stats.totalSales.toLocaleString()}</p>
            <p className="text-xs text-green-600">+12% this month</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Items Sold</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.itemsSold}</p>
            <p className="text-xs text-blue-600">This month</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-sm">🌱</span>
              <span className="text-sm text-gray-600">CO₂ Saved</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.co2Saved}kg</p>
            <p className="text-xs text-green-600">Environmental impact</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-600 text-sm">⭐</span>
              <span className="text-sm text-gray-600">Rating</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.avgRating}</p>
            <p className="text-xs text-gray-600">Based on 47 reviews</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Active Listings</h3>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {activeListings.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <Badge 
                    variant={item.status === 'active' ? 'default' : 'destructive'}
                    className={item.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {item.status === 'active' ? 'Active' : 'Low Stock'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-4">
                    <span>
                      <span className="line-through">KSh {item.originalPrice}</span>
                      <span className="ml-2 font-medium text-orange-600">KSh {item.discountPrice}</span>
                    </span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{item.pickupTime}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-white/90 mb-3">
            Contact our partner support team for assistance with your listings or account.
          </p>
          <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
