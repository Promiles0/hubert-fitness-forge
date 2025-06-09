
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import EnhancedAdminStatsGrid from "@/components/admin/EnhancedAdminStatsGrid";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import { useEnhancedAdminStats } from "@/hooks/useEnhancedAdminStats";
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
  Settings
} from "lucide-react";

const AdminDashboardPage = () => {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: stats, isLoading } = useEnhancedAdminStats();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is authenticated and has admin permissions
  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast({
        title: "Access Denied",
        description: "Please login to access the admin dashboard",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasRole('admin')) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard",
        variant: "destructive",
      });
    }
  }, [user, hasRole, navigate]);

  // Navigation items
  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart2,
      description: "Overview & analytics",
      active: location.pathname === "/admin"
    },
    {
      name: "Members",
      href: "/admin/members",
      icon: Users,
      description: "Manage members",
      active: location.pathname === "/admin/members"
    },
    {
      name: "Classes",
      href: "/admin/classes",
      icon: Calendar,
      description: "Schedule & classes",
      active: location.pathname === "/admin/classes"
    },
    {
      name: "Trainers",
      href: "/admin/trainers",
      icon: User,
      description: "Staff management",
      active: location.pathname === "/admin/trainers"
    },
    {
      name: "Plans",
      href: "/admin/plans",
      icon: FileText,
      description: "Membership plans",
      active: location.pathname === "/admin/plans"
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: DollarSign,
      description: "Financial records",
      active: location.pathname === "/admin/payments"
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      description: "Communication",
      active: location.pathname === "/admin/messages"
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: Activity,
      description: "Analytics & reports",
      active: location.pathname === "/admin/reports"
    },
    {
      name: "Store",
      href: "/admin/store",
      icon: Store,
      description: "Product management",
      active: location.pathname === "/admin/store"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "System configuration",
      active: location.pathname === "/admin/settings"
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Don't render if user doesn't have access
  if (!user || !hasRole('admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-fitness-black text-white">
      <div className="flex">
        <AdminSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          onLogout={handleLogout}
        />
        <div className="flex-1 md:ml-64">
          <AdminHeader 
            setSidebarOpen={setSidebarOpen}
            currentPageName="Dashboard"
            currentPageDescription="Welcome to your admin dashboard"
          />
          <main className="p-6 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-fitness-red to-red-600 rounded-lg p-6 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, Admin! 👋
              </h1>
              <p className="text-white/90">
                Here's what's happening with your fitness center today.
              </p>
            </div>

            {/* Enhanced Stats Grid */}
            <EnhancedAdminStatsGrid stats={stats} isLoading={isLoading} />

            {/* Recent Activity */}
            <AdminRecentActivity stats={stats} />

            {/* Quick Actions */}
            <div className="bg-fitness-darkGray rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/admin/members')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
                >
                  View All Members
                </button>
                <button 
                  onClick={() => navigate('/admin/classes')}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors"
                >
                  Manage Classes
                </button>
                <button 
                  onClick={() => navigate('/admin/settings')}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors"
                >
                  System Settings
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
