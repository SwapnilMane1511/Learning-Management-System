import React from "react";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to get data</h1>;

  const { purchasedCourse } = data || { purchasedCourse: [] };

  const courseData = purchasedCourse.map((c) => ({
    name: c.courseId?.courseTitle,
    price: c.courseId?.coursePrice || 0,
  }));

  const totalRevenue = purchasedCourse.reduce((acc, el) => acc + (el.amount || 0), 0);
  const totalSales = purchasedCourse.length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Total Sales */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="shadow-lg hover:shadow-xl transition">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="shadow-lg dark:text-blue-600 hover:shadow-xl transition col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Course Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-5}
                textAnchor="end"
                interval={0}
                stroke="#888"
              />
              <YAxis stroke="#888" />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
