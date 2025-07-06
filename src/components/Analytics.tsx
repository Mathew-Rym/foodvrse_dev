
import React from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Analytics = () => {
  const salesData = [
    { day: 'Mon', sales: 2400, orders: 12 },
    { day: 'Tue', sales: 1800, orders: 9 },
    { day: 'Wed', sales: 3200, orders: 16 },
    { day: 'Thu', sales: 2800, orders: 14 },
    { day: 'Fri', sales: 4200, orders: 21 },	
    { day: 'Sat', sales: 3800, orders: 19 },
    { day: 'Sun', sales: 2200, orders: 11 }
  ];

  const categoryData = [
    { name: 'Pastries', value: 35, color: '#FF6B35' },
    { name: 'Salads', value: 28, color: '#4ECDC4' },
    { name: 'Hot Food', value: 22, color: '#45B7D1' },
    { name: 'Beverages', value: 15, color: '#96CEB4' }
  ];

  const timeData = [
    { hour: '10:00', orders: 2 },
    { hour: '12:00', orders: 8 },
    { hour: '14:00', orders: 12 },
    { hour: '16:00', orders: 15 },
    { hour: '18:00', orders: 18 },
    { hour: '20:00', orders: 8 },
    { hour: '22:00', orders: 3 }
  ];

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

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      {/* Weekly Sales Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Weekly Sales Performance</h3>
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
      </Card>

      {/* Category Distribution */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
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
      </Card>

      {/* Peak Hours */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Peak Ordering Hours</h3>
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
      </Card>

      {/* Key Insights */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span>Best performing day:</span>
            <span className="font-semibold text-green-700">Friday (KSh 4,200)</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span>Peak ordering time:</span>
            <span className="font-semibold text-blue-700">6:00 PM (18 orders)</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
            <span>Top category:</span>
            <span className="font-semibold text-orange-700">Pastries (35%)</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
            <span>Average order value:</span>
            <span className="font-semibold text-purple-700">KSh 195</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
