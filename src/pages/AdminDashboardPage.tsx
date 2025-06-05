
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  Activity, 
  Calendar, 
  BarChart2, 
  User, 
  DollarSign, 
  Edit, 
  MessageSquare, 
  FileText, 
  Store, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  Dumbbell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Award,
  Target,
  Zap,
  Home
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  
  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    
    if (!hasRole('admin')) {
      navigate("/dashboard");
      toast.error("Access denied. Admin privileges required.");
    }
  }, [user, hasRole, navigate, location.pathname]);

  // Fetch comprehensive dashboard statistics
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-comprehensive-stats'],
    queryFn: async () => {
      // Get member statistics
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      
      const { count: activeMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get class statistics
      const { count: totalClasses } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: todayBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      // Get trainer statistics
      const { count: activeTrainers } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get revenue statistics
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'successful')
        .gte('payment_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`);
      
      const monthlyRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Get recent activity
      const { data: recentMembers } = await supabase
        .from('members')
        .select('first_name, last_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          created_at,
          members!inner(first_name, last_name),
          classes!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        totalClasses: totalClasses || 0,
        todayBookings: todayBookings || 0,
        activeTrainers: activeTrainers || 0,
        monthlyRevenue,
        recentMembers: recentMembers || [],
        recentBookings: recentBookings || []
      };
    },
    refetchInterval: 30000,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/admin", 
      icon: BarChart2, 
      description: "Overview & Analytics",
      active: location.pathname === "/admin"
    },
    { 
      name: "Members", 
      href: "/admin/members", 
      icon: Users, 
      description: "Manage Members",
      active: location.pathname === "/admin/members"
    },
    { 
      name: "Classes", 
      href: "/admin/classes", 
      icon: Calendar, 
      description: "Schedule & Bookings",
      active: location.pathname === "/admin/classes"
    },
    { 
      name: "Trainers", 
      href: "/admin/trainers", 
      icon: User, 
      description: "Staff Management",
      active: location.pathname === "/admin/trainers"
    },
    { 
      name: "Payments", 
      href: "/admin/payments", 
      icon: DollarSign, 
      description: "Financial Records",
      active: location.pathname === "/admin/payments"
    },
    { 
      name: "Plans", 
      href: "/admin/membership-plans", 
      icon: Edit, 
      description: "Membership Plans",
      active: location.pathname === "/admin/membership-plans"
    },
    { 
      name: "Messages", 
      href: "/admin/messages", 
      icon: MessageSquare, 
      description: "Communications",
      active: location.pathname === "/admin/messages"
    },
    { 
      name: "Reports", 
      href: "/admin/reports", 
      icon: FileText, 
      description: "Analytics & Logs",
      active: location.pathname === "/admin/reports"
    },
    { 
      name: "Store", 
      href: "/admin/store", 
      icon: Store, 
      description: "Product Management",
      active: location.pathname === "/admin/store"
    },
    { 
      name: "Settings", 
      href: "/admin/settings", 
      icon: Settings, 
      description: "System Configuration",
      active: location.pathname === "/admin/settings"
    }
  ];

  if (!user || !hasRole('admin')) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  const renderDashboardContent = () => {
    if (location.pathname !== "/admin") {
      return (
        <div className="flex items-center justify-center h-96">
          <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Settings className="h-16 w-16 text-fitness-red mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Feature Under Development
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  This section of the admin dashboard is being built. Check back soon for new features and functionality.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-fitness-red hover:bg-red-700"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Members</p>
                  <p className="text-3xl font-bold">
                    {isStatsLoading ? <LoadingSpinner size={24} /> : stats?.totalMembers || 0}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    {stats?.activeMembers || 0} active
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Today's Bookings</p>
                  <p className="text-3xl font-bold">
                    {isStatsLoading ? <LoadingSpinner size={24} /> : stats?.todayBookings || 0}
                  </p>
                  <p className="text-green-200 text-xs mt-1">Classes booked</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Trainers</p>
                  <p className="text-3xl font-bold">
                    {isStatsLoading ? <LoadingSpinner size={24} /> : stats?.activeTrainers || 0}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">Staff ready</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Award className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold">
                    {isStatsLoading ? <LoadingSpinner size={24} /> : `$${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`}
                  </p>
                  <p className="text-orange-200 text-xs mt-1">This month</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-fitness-red" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/members">
                <Button className="w-full bg-fitness-red hover:bg-red-700 h-12">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </Link>
              <Link to="/admin/classes">
                <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Class
                </Button>
              </Link>
              <Link to="/admin/trainers">
                <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Manage Staff
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-fitness-red" />
                Recent Member Registrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.recentMembers?.length ? (
                stats.recentMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-fitness-red text-white">
                          {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Joined {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      New
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent registrations
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-fitness-red" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.recentBookings?.length ? (
                stats.recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.classes.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        by {booking.members.first_name} {booking.members.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="border-fitness-red text-fitness-red">
                        Booked
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent bookings
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-fitness-dark flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-fitness-darkGray border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3">
              <Dumbbell className="h-8 w-8 text-fitness-red" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="text-fitness-red">HUBERT</span> FITNESS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-500 dark:text-gray-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full p-0 h-auto justify-start">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-fitness-red text-white">
                        {user?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Administrator
                      </p>
                      <Badge className="bg-fitness-red/20 text-fitness-red border-0 text-xs mt-1">
                        Admin Access
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? 'bg-fitness-red text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${item.active ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-fitness-darkGray border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Header for desktop */}
        <div className="hidden lg:flex items-center justify-between p-6 bg-white dark:bg-fitness-darkGray border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {navigation.find(item => item.active)?.name || 'Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {navigation.find(item => item.active)?.description || 'Welcome to your admin dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-fitness-dark">
          <div className="p-6 max-w-7xl mx-auto">
            {renderDashboardContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
