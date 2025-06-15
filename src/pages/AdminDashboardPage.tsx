
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user || !hasRole('admin')) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
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
