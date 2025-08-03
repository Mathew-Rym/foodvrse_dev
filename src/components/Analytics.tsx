
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Get business profile
        const { data: profile } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!profile) return;

        // Fetch real performance data
        const { data: performanceData } = await supabase
          .from('listing_performance')
          .select('*')
          .eq('business_id', profile.id)
          .order('date', { ascending: true });

        // Fetch orders data for time analysis
        const { data: ordersData } = await supabase
          .from('orders')
          .select('created_at, total_amount, mystery_bag_id')
          .eq('business_id', profile.id)
          .eq('status', 'collected');

        // Fetch listings for category analysis
        const { data: listingsData } = await supabase
          .from('listings')
          .select('category, price, quantity, initial_quantity')
          .eq('business_id', profile.id);

        // Process sales data by day
        const dailySales = performanceData?.reduce((acc, item) => {
          const day = new Date(item.date).toLocaleDateString('en', { weekday: 'short' });
          const existing = acc.find(d => d.day === day);
          if (existing) {
            existing.sales += item.revenue || 0;
            existing.orders += item.purchases || 0;
          } else {
            acc.push({
              day,
              sales: item.revenue || 0,
              orders: item.purchases || 0
            });
          }
          return acc;
        }, []) || [];

        setSalesData(dailySales);

        // Process category data
        const categoryStats = listingsData?.reduce((acc, item) => {
          const existing = acc.find(c => c.name === item.category);
          const soldItems = item.initial_quantity - item.quantity;
          if (existing) {
            existing.value += soldItems;
          } else {
            acc.push({
              name: item.category,
              value: soldItems,
              color: getCategoryColor(item.category)
            });
          }
          return acc;
        }, []) || [];

        // Convert to percentages
        const totalSold = categoryStats.reduce((sum, cat) => sum + cat.value, 0);
        const categoryPercentages = categoryStats.map(cat => ({
          ...cat,
          value: totalSold > 0 ? Math.round((cat.value / totalSold) * 100) : 0
        }));

        setCategoryData(categoryPercentages);

        // Process time data from orders
        const hourlyOrders = Array.from({ length: 12 }, (_, i) => {
          const hour = i + 10; // 10 AM to 9 PM
          const hourString = `${hour}:00`;
          const orderCount = ordersData?.filter(order => {
            const orderHour = new Date(order.created_at).getHours();
            return orderHour === hour;
          }).length || 0;
          
          return { hour: hourString, orders: orderCount };
        });

        setTimeData(hourlyOrders);

      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Meals': '#FF6B35',
      'Pastries': '#4ECDC4',
      'Beverages': '#45B7D1',
      'Dairy': '#96CEB4',
      'Fruits': '#FECA57',
      'Vegetables': '#48CAE4'
    };
    return colors[category] || '#95A5A6';
  };

  const chartConfig = {
    sales: {
      label: "Sales (KSh)",
      color: "#FF6B35",
    },
    orders: {
      label: "Orders",
      color: "#4ECDC4",
    },
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const bestDay = salesData.reduce((best, day) => 
    day.sales > (best?.sales || 0) ? day : best, null
  );
  
  const peakHour = timeData.reduce((peak, hour) => 
    hour.orders > (peak?.orders || 0) ? hour : peak, null
  );
  
  const topCategory = categoryData.reduce((top, cat) => 
    cat.value > (top?.value || 0) ? cat : top, null
  );

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold text-gray-900">Real-Time Analytics Dashboard</h2>
      
      {/* Weekly Sales Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Weekly Sales Performance</h3>
        {salesData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No sales data available yet. Start selling to see analytics!
          </div>
        )}
      </Card>

      {/* Category Distribution */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
        {categoryData.length > 0 ? (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No category data available yet.
          </div>
        )}
      </Card>

      {/* Peak Hours */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Peak Ordering Hours</h3>
        {timeData.some(hour => hour.orders > 0) ? (
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--color-orders)" 
                  strokeWidth={3}
                  dot={{ fill: "var(--color-orders)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No order time data available yet.
          </div>
        )}
      </Card>

      {/* Key Insights */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span>Best performing day:</span>
            <span className="font-semibold text-green-700">
              {bestDay ? `${bestDay.day} (KSh ${bestDay.sales.toLocaleString()})` : 'No data yet'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span>Peak ordering time:</span>
            <span className="font-semibold text-blue-700">
              {peakHour ? `${peakHour.hour} (${peakHour.orders} orders)` : 'No data yet'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-brand-light-green rounded">
            <span>Top category:</span>
            <span className="font-semibold text-brand-green">
              {topCategory ? `${topCategory.name} (${topCategory.value}%)` : 'No data yet'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
            <span>Average order value:</span>
            <span className="font-semibold text-purple-700">KSh {avgOrderValue.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
