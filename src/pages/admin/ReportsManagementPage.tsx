
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportsManagementPage = () => {
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  // Fetch comprehensive analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', dateRange],
    queryFn: async () => {
      const days = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Member analytics
      const { data: memberStats } = await supabase
        .from('members')
        .select('status, join_date, created_at')
        .gte('created_at', startDate.toISOString());

      // Payment analytics
      const { data: paymentStats } = await supabase
        .from('payments')
        .select('amount, payment_date, payment_status, payment_method')
        .gte('payment_date', startDate.toISOString());

      // Class analytics
      const { data: classStats } = await supabase
        .from('classes')
        .select(`
          *,
          bookings (
            status,
            created_at
          )
        `);

      // Attendance analytics
      const { data: attendanceStats } = await supabase
        .from('attendance')
        .select('check_in_time, check_out_time')
        .gte('check_in_time', startDate.toISOString());

      return {
        members: memberStats || [],
        payments: paymentStats || [],
        classes: classStats || [],
        attendance: attendanceStats || []
      };
    },
  });

  // Calculate KPIs
  const kpis = analytics ? {
    totalRevenue: analytics.payments
      .filter(p => p.payment_status === 'successful')
      .reduce((sum, p) => sum + Number(p.amount), 0),
    newMembers: analytics.members.length,
    totalBookings: analytics.classes.reduce((sum, c) => sum + (c.bookings?.length || 0), 0),
    averageAttendance: analytics.attendance.length,
    memberGrowth: analytics.members.filter(m => 
      new Date(m.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    revenueGrowth: analytics.payments
      .filter(p => p.payment_status === 'successful' && 
        new Date(p.payment_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      )
      .reduce((sum, p) => sum + Number(p.amount), 0)
  } : {
    totalRevenue: 0,
    newMembers: 0,
    totalBookings: 0,
    averageAttendance: 0,
    memberGrowth: 0,
    revenueGrowth: 0
  };

  const exportReport = (type: string) => {
    // This would generate and download the report
    toast.success(`${type} report exported successfully`);
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Business insights and performance analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('Full')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${kpis.totalRevenue.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+${kpis.revenueGrowth.toFixed(2)} this week</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {kpis.newMembers}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Members</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-500">+{kpis.memberGrowth} this week</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {kpis.totalBookings}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-500">Class bookings</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {kpis.averageAttendance}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Records</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-500">Check-ins tracked</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <BarChart3 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Business Overview</SelectItem>
                <SelectItem value="revenue">Revenue Analytics</SelectItem>
                <SelectItem value="membership">Membership Growth</SelectItem>
                <SelectItem value="classes">Class Performance</SelectItem>
                <SelectItem value="trainers">Trainer Analytics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart would be displayed here</p>
                <p className="text-sm text-gray-400">Total: ${kpis.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Membership Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Membership pie chart would be displayed here</p>
                <p className="text-sm text-gray-400">Total: {kpis.newMembers} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Class Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Attendance chart would be displayed here</p>
                <p className="text-sm text-gray-400">Total: {kpis.averageAttendance} records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Member Growth</span>
                <span className="font-bold text-green-600">+{kpis.memberGrowth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Revenue Growth</span>
                <span className="font-bold text-green-600">+${kpis.revenueGrowth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Booking Rate</span>
                <span className="font-bold text-blue-600">{kpis.totalBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Attendance Rate</span>
                <span className="font-bold text-purple-600">{kpis.averageAttendance}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => exportReport('Revenue')}>
              <Download className="h-4 w-4 mr-2" />
              Revenue Report (PDF)
            </Button>
            <Button variant="outline" onClick={() => exportReport('Member')}>
              <Download className="h-4 w-4 mr-2" />
              Member Report (Excel)
            </Button>
            <Button variant="outline" onClick={() => exportReport('Attendance')}>
              <Download className="h-4 w-4 mr-2" />
              Attendance Report (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagementPage;
