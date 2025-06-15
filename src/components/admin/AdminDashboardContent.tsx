
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminDashboardContent = () => {
  const { data: stats, isLoading: isStatsLoading } = useAdminStats();

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

export default AdminDashboardContent;
