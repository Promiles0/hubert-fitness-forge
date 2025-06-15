
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageRenderer from "@/components/admin/AdminPageRenderer";
import { getAdminNavigation } from "@/components/admin/AdminNavigation";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole, loading, rolesLoading } = useAuth();
  const [accessChecked, setAccessChecked] = useState(false);

  // Check admin access
  useEffect(() => {
    // Don't check access until auth is fully loaded
    if (loading || rolesLoading) return;

    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    
    // Only check access once roles are fully loaded
    if (!rolesLoading) {
      if (!hasRole('admin')) {
        console.log('Access denied: User does not have admin role');
        navigate("/dashboard");
        toast.error("Access denied. Admin privileges required.");
      } else {
        console.log('Admin access granted');
        setAccessChecked(true);
      }
    }
  }, [user, hasRole, navigate, location.pathname, loading, rolesLoading]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Show loading while auth is loading, roles are loading, or access is being checked
  if (loading || rolesLoading || !accessChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-fitness-dark flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Final check - if user doesn't exist or doesn't have admin role, don't render
  if (!user || !hasRole('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-fitness-dark flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  const navigation = getAdminNavigation(location.pathname);
  const currentPage = navigation.find(item => item.active);

  return (
    <AdminLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      navigation={navigation}
      onLogout={handleLogout}
      currentPageName={currentPage?.name}
      currentPageDescription={currentPage?.description}
    >
      <AdminPageRenderer currentPath={location.pathname} />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
