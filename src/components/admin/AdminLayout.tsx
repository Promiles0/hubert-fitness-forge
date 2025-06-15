
import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigation: Array<{
    name: string;
    href: string;
    icon: any;
    description: string;
    active: boolean;
  }>;
  onLogout: () => void;
  currentPageName?: string;
  currentPageDescription?: string;
}

const AdminLayout = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  navigation,
  onLogout,
  currentPageName,
  currentPageDescription
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-fitness-dark flex w-full">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <AdminHeader
          setSidebarOpen={setSidebarOpen}
          currentPageName={currentPageName}
          currentPageDescription={currentPageDescription}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-fitness-dark">
          <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
