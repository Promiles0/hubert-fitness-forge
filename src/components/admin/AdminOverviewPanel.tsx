
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const AdminOverviewPanel = () => {
  const [dateRange, setDateRange] = useState("month");

  // Membership Growth Data (Line Chart)
  const membershipData = [
    { month: "Jan", signups: 65 },
    { month: "Feb", signups: 59 },
    { month: "Mar", signups: 80 },
    { month: "Apr", signups: 81 },
    { month: "May", signups: 56 },
    { month: "Jun", signups: 55 },
    { month: "Jul", signups: 40 },
    { month: "Aug", signups: 70 },
    { month: "Sep", signups: 90 },
    { month: "Oct", signups: 110 },
    { month: "Nov", signups: 130 },
    { month: "Dec", signups: 150 },
  ];

  // Trainer Performance Data (Bar Chart)
  const trainerData = [
    { name: "Michael", sessions: 65, rating: 4.8 },
    { name: "Sarah", sessions: 45, rating: 4.9 },
    { name: "David", sessions: 55, rating: 4.5 },
    { name: "Emma", sessions: 35, rating: 4.7 },
    { name: "John", sessions: 50, rating: 4.6 },
  ];

  // Revenue Breakdown Data (Pie Chart)
  const revenueData = [
    { name: "Memberships", value: 8500, fill: "#8884d8" },
    { name: "Training", value: 2500, fill: "#82ca9d" },
    { name: "Merchandise", value: 800, fill: "#ffc658" },
    { name: "Supplements", value: 500, fill: "#ff8042" },
  ];

  // Class Attendance Data (by hour)
  const attendanceData = [
    { hour: "6am", attendance: 15 },
    { hour: "8am", attendance: 25 },
    { hour: "10am", attendance: 18 },
    { hour: "12pm", attendance: 22 },
    { hour: "2pm", attendance: 15 },
    { hour: "4pm", attendance: 28 },
    { hour: "6pm", attendance: 35 },
    { hour: "8pm", attendance: 30 },
  ];

  // Filter data based on selected date range
  const filterData = (range: string) => {
    setDateRange(range);
    // In a real app, this would filter the data based on the selected range
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Analytics Overview</h2>
        <div className="flex gap-2">
          <Button 
            variant={dateRange === "week" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterData("week")}
            className={dateRange === "week" ? "bg-fitness-red hover:bg-red-700" : "text-white"}
          >
            Week
          </Button>
          <Button 
            variant={dateRange === "month" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterData("month")}
            className={dateRange === "month" ? "bg-fitness-red hover:bg-red-700" : "text-white"}
          >
            Month
          </Button>
          <Button 
            variant={dateRange === "quarter" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterData("quarter")}
            className={dateRange === "quarter" ? "bg-fitness-red hover:bg-red-700" : "text-white"}
          >
            Quarter
          </Button>
          <Button 
            variant={dateRange === "year" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterData("year")}
            className={dateRange === "year" ? "bg-fitness-red hover:bg-red-700" : "text-white"}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Growth Chart */}
        <Card className="bg-fitness-darkGray border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Membership Growth</CardTitle>
            <CardDescription className="text-gray-400">Monthly new signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={membershipData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#222', 
                      border: '1px solid #444', 
                      color: '#fff' 
                    }} 
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    name="New Members"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class Attendance Chart */}
        <Card className="bg-fitness-darkGray border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
            <CardDescription className="text-gray-400">Attendance by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="hour" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#222', 
                      border: '1px solid #444', 
                      color: '#fff' 
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="attendance" 
                    name="Attendance" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trainer Performance Chart */}
        <Card className="bg-fitness-darkGray border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Trainer Performance</CardTitle>
            <CardDescription className="text-gray-400">Sessions vs. Rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trainerData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis yAxisId="left" orientation="left" stroke="#888" />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#222', 
                      border: '1px solid #444', 
                      color: '#fff' 
                    }} 
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="sessions" 
                    name="Sessions" 
                    fill="#82ca9d" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="rating" 
                    name="Rating" 
                    fill="#f43f5e" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown Chart */}
        <Card className="bg-fitness-darkGray border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription className="text-gray-400">By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#222', 
                      border: '1px solid #444', 
                      color: '#fff' 
                    }} 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPanel;
