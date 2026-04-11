import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import React from "react";
import { Loader2 } from "lucide-react";
import { useGetAllInstructorSalesQuery } from "@/features/api/purchaseApi";

const Dashboard = () => {
  const { data, isSuccess, isLoading, isError } =
    useGetAllInstructorSalesQuery();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Unable to load dashboard data.</p>
      </div>
    );
  }

  const purchasedCourses = data?.purchasedCourses || [];

  const courseData = purchasedCourses.map((purchase) => ({
    name: purchase.courseId.courseTitle,
    price: purchase.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourses.reduce((total, purchase) => {
    return total + purchase.courseId.coursePrice;
  }, 0);

  const totalSales = purchasedCourses.length;

  console.log(data);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow-duration-300 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Total Sales</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {totalSales}
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow-duration-300 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {`PKR ${totalRevenue}`}
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={courseData} margin={{ top: 10, right: 30, left: 10, bottom: 100 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4a90e2" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={120}
                tick={{ fontSize: 13, fill: '#374151' }}
                tickMargin={15}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={(value) => [`PKR ${value}`, "Price"]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                fill="url(#colorPrice)"
                activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                name="Course Price"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
