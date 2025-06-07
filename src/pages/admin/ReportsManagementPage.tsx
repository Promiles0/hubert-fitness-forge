
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const ReportsManagementPage = () => {
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      // Get member registrations by month
      const { data: memberStats } = await supabase
        .from('members')
        .select('created_at, status')
        .order('created_at');

      // Get payment statistics
      const { data: paymentStats } = await supabase
        .from('payments')
        .select('amount, payment_date, payment_status')
        .eq('payment_status', 'successful')
        .order('payment_date');

      // Get class booking statistics
      const { data: bookingStats } = await supabase
        .from('bookings')
        .select('created_at, status')
        .order('created_at');

      // Get trainer statistics
      const { data: trainerStats } = await supabase
        .from('trainers')
        .select('specialties, is_active, created_at');

      return {
        memberStats: memberStats || [],
        paymentStats: paymentStats || [],
        bookingStats: bookingStats || [],
        trainerStats: trainerStats || []
      };
    },
  });

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  // Process data for charts
  const monthlyRevenue = reportsData?.paymentStats.reduce((acc: any[], payment) => {
    const month = new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.revenue += Number(payment.amount);
    } else {
      acc.push({ month, revenue: Number(payment.amount) });
    }
    return acc;
  }, []) || [];

  const memberGrowth = reportsData?.memberStats.reduce((acc: any[], member) => {
    const month = new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.members += 1;
    } else {
      acc.push({ month, members: 1 });
    }
    return acc;
  }, []) || [];

  const statusDistribution = reportsData?.memberStats.reduce((acc: any[], member) => {
    const existing = acc.find(item => item.name === member.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: member.status, value: 1 });
    }
    return acc;
  }, []) || [];

  const totalRevenue = reportsData?.paymentStats.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  const totalMembers = reportsData?.memberStats.length || 0;
  const totalBookings = reportsData?.bookingStats.length || 0;
  const activeTrainers = reportsData?.trainerStats.filter(t => t.is_active).length || 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive insights into your fitness center's performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-blue-600">{totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600">{totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Trainers</p>
                <p className="text-2xl font-bold text-orange-600">{activeTrainers}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Member Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memberGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">This Month's Revenue</span>
                <span className="font-semibold">
                  ${monthlyRevenue[monthlyRevenue.length - 1]?.revenue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Members This Month</span>
                <span className="font-semibold">
                  {memberGrowth[memberGrowth.length - 1]?.members || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Members</span>
                <span className="font-semibold">
                  {statusDistribution.find(s => s.name === 'active')?.value || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Members</span>
                <span className="font-semibold">
                  {statusDistribution.find(s => s.name === 'pending')?.value || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManagementPage;
