
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

// Import admin page components
import MembersManagementPage from "./admin/MembersManagementPage";
import ClassesManagementPage from "./admin/ClassesManagementPage";
import TrainersManagementPage from "./admin/TrainersManagementPage";
import PaymentsManagementPage from "./admin/PaymentsManagementPage";
import PlansManagementPage from "./admin/PlansManagementPage";
import MessagesManagementPage from "./admin/MessagesManagementPage";
import ReportsManagementPage from "./admin/ReportsManagementPage";
import StoreManagementPage from "./admin/StoreManagementPage";
import SettingsManagementPage from "./admin/SettingsManagementPage";

// Import new components
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  
  // Fetch comprehensive dashboard statistics
  const { data: stats, isLoading: isStatsLoading } = useAdminStats();

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

  const renderPageContent = () => {
    switch (location.pathname) {
      case "/admin/members":
        return <MembersManagementPage />;
      case "/admin/classes":
        return <ClassesManagementPage />;
      case "/admin/trainers":
        return <TrainersManagementPage />;
      case "/admin/payments":
        return <PaymentsManagementPage />;
      case "/admin/membership-plans":
        return <PlansManagementPage />;
      case "/admin/messages":
        return <MessagesManagementPage />;
      case "/admin/reports":
        return <ReportsManagementPage />;
      case "/admin/store":
        return <StoreManagementPage />;
      case "/admin/settings":
        return <SettingsManagementPage />;
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => {
    if (location.pathname !== "/admin") {
      return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg w-full max-w-md">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="mb-4">
                <Settings className="h-12 w-12 sm:h-16 sm:w-16 text-fitness-red mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Feature Under Development
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  This section of the admin dashboard is being built. Check back soon for new features and functionality.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-fitness-red hover:bg-red-700 w-full sm:w-auto"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Enhanced Stats Grid */}
        <AdminStatsGrid stats={stats} isLoading={isStatsLoading} />

        {/* Quick Actions */}
        <AdminQuickActions />

        {/* Recent Activity */}
        <AdminRecentActivity stats={stats} />
      </div>
    );
  };

  const currentPage = navigation.find(item => item.active);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-fitness-dark flex w-full">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <AdminHeader
          setSidebarOpen={setSidebarOpen}
          currentPageName={currentPage?.name}
          currentPageDescription={currentPage?.description}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-fitness-dark">
          <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
