
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  Shield, 
  Settings, 
  Bell, 
  LogOut,
  Sidebar as SidebarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminOverviewPanel from "@/components/admin/AdminOverviewPanel";
import MembersPage from "./admin/MembersPage";
import ClassesPage from "./admin/ClassesPage";
import TrainersPage from "./admin/TrainersPage";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(4);
  const { user, logout, hasRole } = useAuth();
  
  // Set a default username if user doesn't have one
  const username = user?.name || "Admin";
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

  // Check if user is authenticated and has admin permissions
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      toast({
        title: "Access Denied",
        description: "Please login to access the admin dashboard",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the user has the admin role
    if (!hasRole('admin')) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard",
        variant: "destructive",
      });
    }
  }, [user, hasRole, navigate, location.pathname]);

  // Fetch dashboard statistics
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Get active members count
      const { count: activeMembers, error: membersError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (membersError) throw membersError;
      
      // Get today's bookings count
      const today = new Date().toISOString().split('T')[0];
      const { count: todayBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      
      if (bookingsError) throw bookingsError;
      
      // Get active trainers count
      const { count: activeTrainers, error: trainersError } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (trainersError) throw trainersError;
      
      // Get total revenue this month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lte('payment_date', new Date().toISOString())
        .eq('payment_status', 'successful');
      
      if (paymentsError) throw paymentsError;
      
      const monthlyRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      return {
        activeMembers: activeMembers || 0,
        todayBookings: todayBookings || 0,
        activeTrainers: activeTrainers || 0,
        monthlyRevenue
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Determine which component to render based on the current path
  const renderContent = () => {
    switch (location.pathname) {
      case "/admin/members":
        return <MembersPage />;
      case "/admin/classes":
        return <ClassesPage />;
      case "/admin/trainers":
        return <TrainersPage />;
      case "/admin":
        return (
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-fitness-darkGray border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-400">Active Members</div>
                    <Users className="h-5 w-5 text-fitness-red" />
                  </div>
                  <div className="text-3xl font-bold">
                    {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.activeMembers || 0}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Total active memberships</div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-darkGray border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-400">Today's Bookings</div>
                    <Calendar className="h-5 w-5 text-fitness-red" />
                  </div>
                  <div className="text-3xl font-bold">
                    {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.todayBookings || 0}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Classes booked today</div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-darkGray border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-400">Active Trainers</div>
                    <User className="h-5 w-5 text-fitness-red" />
                  </div>
                  <div className="text-3xl font-bold">
                    {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.activeTrainers || 0}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Staff ready to train</div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-darkGray border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-400">Monthly Revenue</div>
                    <DollarSign className="h-5 w-5 text-fitness-red" />
                  </div>
                  <div className="text-3xl font-bold">
                    {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${stats?.monthlyRevenue.toFixed(2) || '0.00'}`}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">This month's income</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Dashboard Analytics */}
            <AdminOverviewPanel />
            
            {/* Recent Activity and Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-fitness-darkGray border-gray-800 text-white">
                <CardHeader>
                  <CardTitle>Recent Member Activity</CardTitle>
                  <CardDescription className="text-gray-400">Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <div className="flex justify-between">
                        <span className="font-medium">John Doe</span>
                        <span className="text-gray-400 text-sm">2 hours ago</span>
                      </div>
                      <p className="text-gray-400 text-sm">Signed up for Premium Plan</p>
                    </li>
                    <li className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <div className="flex justify-between">
                        <span className="font-medium">Sarah Wilson</span>
                        <span className="text-gray-400 text-sm">5 hours ago</span>
                      </div>
                      <p className="text-gray-400 text-sm">Booked HIIT class with Michael</p>
                    </li>
                    <li className="bg-fitness-black p-3 rounded-md border border-gray-800">
                      <div className="flex justify-between">
                        <span className="font-medium">Robert Johnson</span>
                        <span className="text-gray-400 text-sm">8 hours ago</span>
                      </div>
                      <p className="text-gray-400 text-sm">Renewed Monthly Membership</p>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4 border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-darkGray border-gray-800 text-white">
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription className="text-gray-400">Requires attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="bg-red-900/20 p-3 rounded-md border border-red-900/50">
                      <div className="flex justify-between">
                        <span className="font-medium">Payment Failed</span>
                        <span className="text-gray-400 text-sm">High Priority</span>
                      </div>
                      <p className="text-gray-400 text-sm">3 members with failed payment attempts</p>
                    </li>
                    <li className="bg-yellow-900/20 p-3 rounded-md border border-yellow-900/50">
                      <div className="flex justify-between">
                        <span className="font-medium">Class Capacity</span>
                        <span className="text-gray-400 text-sm">Medium Priority</span>
                      </div>
                      <p className="text-gray-400 text-sm">Yoga class at 6PM is near capacity</p>
                    </li>
                    <li className="bg-blue-900/20 p-3 rounded-md border border-blue-900/50">
                      <div className="flex justify-between">
                        <span className="font-medium">Trainer Request</span>
                        <span className="text-gray-400 text-sm">Low Priority</span>
                      </div>
                      <p className="text-gray-400 text-sm">New trainer application needs review</p>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4 border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                    Address All Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <Card className="bg-fitness-darkGray border-gray-800 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-fitness-red mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Page Under Construction</h3>
                  <p className="text-gray-400 mb-4">
                    This section of the admin dashboard is still being developed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (!user) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-fitness-black flex flex-col">
      {/* Main Dashboard Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className={`bg-fitness-darkGray border-r border-gray-800 transition-all duration-300 ${sidebarCollapsed ? 'w-[70px]' : 'w-64'}`}>
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            {!sidebarCollapsed && (
              <h1 className="text-white font-bold text-xl">Admin Panel</h1>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-white"
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
          
          <div className={`flex items-center gap-3 p-4 mb-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-10 w-10 border border-fitness-red">
              <AvatarImage src={userAvatar} alt={username} />
              <AvatarFallback className="bg-fitness-red text-white">
                {username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div>
                <p className="text-white font-medium">{username}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
          </div>
          
          <nav className="p-2 space-y-1">
            <Link to="/admin" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin") && location.pathname === "/admin"
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <BarChart2 className="h-5 w-5" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </Link>
            
            <Link to="/admin/members" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/members") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Users className="h-5 w-5" />
              {!sidebarCollapsed && <span>Members</span>}
            </Link>
            
            <Link to="/admin/classes" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/classes") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Calendar className="h-5 w-5" />
              {!sidebarCollapsed && <span>Classes</span>}
            </Link>
            
            <Link to="/admin/trainers" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/trainers") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <User className="h-5 w-5" />
              {!sidebarCollapsed && <span>Trainers</span>}
            </Link>
            
            <Link to="/admin/payments" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/payments") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <DollarSign className="h-5 w-5" />
              {!sidebarCollapsed && <span>Payments</span>}
            </Link>
            
            <Link to="/admin/membership-plans" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/membership-plans") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Edit className="h-5 w-5" />
              {!sidebarCollapsed && <span>Membership Plans</span>}
            </Link>
            
            <Link to="/admin/messages" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/messages") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <MessageSquare className="h-5 w-5" />
              {!sidebarCollapsed && <span>Messages</span>}
            </Link>
            
            <Link to="/admin/reports" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/reports") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <FileText className="h-5 w-5" />
              {!sidebarCollapsed && <span>Reports</span>}
            </Link>
            
            <Link to="/admin/store" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/store") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Store className="h-5 w-5" />
              {!sidebarCollapsed && <span>Store</span>}
            </Link>
            
            <Link to="/admin/settings" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/settings") 
                  ? "bg-fitness-red text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Settings className="h-5 w-5" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Link>
            
            <Separator className="my-2 bg-gray-800" />
            
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-white ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <LogOut className="h-5 w-5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-fitness-black overflow-auto">
          {/* Top Navigation Bar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              {location.pathname === "/admin" ? "Dashboard Overview" : 
               location.pathname === "/admin/members" ? "Members Management" :
               location.pathname === "/admin/classes" ? "Classes & Bookings" :
               location.pathname === "/admin/trainers" ? "Trainers & Staff" :
               location.pathname === "/admin/payments" ? "Payments & Subscriptions" :
               location.pathname === "/admin/membership-plans" ? "Membership Plans" :
               location.pathname === "/admin/messages" ? "Messages & Notifications" :
               location.pathname === "/admin/reports" ? "Reports & Logs" :
               location.pathname === "/admin/store" ? "Store Management" :
               location.pathname === "/admin/settings" ? "Settings & Customization" :
               "Admin Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-white">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-fitness-red rounded-full">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>
              <Link to="/" className="text-white hover:text-fitness-red">
                Return to Site
              </Link>
            </div>
          </div>

          {/* Render the appropriate content based on the current route */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
