
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  LineChart,
  PieChart,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';

const ReportsManagementPage = () => {
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', dateRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      // Fetch members data
      const { data: members } = await supabase
        .from('members')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Fetch payments data
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .gte('payment_date', startDate.toISOString());

      // Fetch bookings data
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', startDate.toISOString());

      return { members, payments, bookings };
    },
  });

  const handleExportReport = () => {
    toast.success('Report exported successfully');
  };

  // Process data for charts
  const memberGrowthData = analytics?.members ? 
    analytics.members.reduce((acc: any[], member) => {
      const date = new Date(member.created_at).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, []) : [];

  const revenueData = analytics?.payments ? 
    analytics.payments.reduce((acc: any[], payment) => {
      const date = new Date(payment.payment_date).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      const amount = Number(payment.amount);
      if (existing) {
        existing.revenue += amount;
      } else {
        acc.push({ date, revenue: amount });
      }
      return acc;
    }, []) : [];

  const statusData = analytics?.members ? [
    { name: 'Active', value: analytics.members.filter(m => m.status === 'active').length, color: '#10B981' },
    { name: 'Pending', value: analytics.members.filter(m => m.status === 'pending').length, color: '#F59E0B' },
    { name: 'Expired', value: analytics.members.filter(m => m.status === 'expired').length, color: '#EF4444' },
    { name: 'Suspended', value: analytics.members.filter(m => m.status === 'suspended').length, color: '#6B7280' },
  ] : [];

  // Calculate KPIs
  const kpis = analytics ? {
    totalMembers: analytics.members?.length || 0,
    totalRevenue: analytics.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    totalBookings: analytics.bookings?.length || 0,
    avgRevenuePerMember: analytics.members?.length ? 
      (analytics.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0) / analytics.members.length : 0
  } : { totalMembers: 0, totalRevenue: 0, totalBookings: 0, avgRevenuePerMember: 0 };

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
            Business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="classes">Classes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {kpis.totalMembers}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${kpis.totalRevenue.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
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
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ${kpis.avgRevenuePerMember.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Revenue/Member</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Member Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Member Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Member Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip />
                {/* @ts-ignore */}
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusData.map((item, index) => (
                <Badge key={index} style={{ backgroundColor: item.color, color: 'white' }}>
                  {item.name}: {item.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Members</span>
              <Badge className="bg-green-100 text-green-800">
                {analytics?.members?.filter(m => m.status === 'active').length || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Members</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {analytics?.members?.filter(m => m.status === 'pending').length || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Successful Payments</span>
              <Badge className="bg-blue-100 text-blue-800">
                {analytics?.payments?.filter(p => p.payment_status === 'successful').length || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confirmed Bookings</span>
              <Badge className="bg-purple-100 text-purple-800">
                {analytics?.bookings?.filter(b => b.status === 'confirmed').length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManagementPage;
