
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";

// Import admin page components
import MembersManagementPage from "@/pages/admin/MembersManagementPage";
import ClassesManagementPage from "@/pages/admin/ClassesManagementPage";
import TrainersManagementPage from "@/pages/admin/TrainersManagementPage";
import PaymentsManagementPage from "@/pages/admin/PaymentsManagementPage";
import PlansManagementPage from "@/pages/admin/PlansManagementPage";
import MessagesManagementPage from "@/pages/admin/MessagesManagementPage";
import ReportsManagementPage from "@/pages/admin/ReportsManagementPage";
import StoreManagementPage from "@/pages/admin/StoreManagementPage";
import SettingsManagementPage from "@/pages/admin/SettingsManagementPage";

interface AdminPageRendererProps {
  currentPath: string;
}

const AdminPageRenderer = ({ currentPath }: AdminPageRendererProps) => {
  const navigate = useNavigate();

  const renderUnderDevelopmentPage = () => (
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

  switch (currentPath) {
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
    case "/admin":
      return <AdminDashboardContent />;
    default:
      return renderUnderDevelopmentPage();
  }
};

export default AdminPageRenderer;
