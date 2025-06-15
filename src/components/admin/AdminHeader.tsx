
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  currentPageName?: string;
  currentPageDescription?: string;
}

const AdminHeader = ({ setSidebarOpen, currentPageName, currentPageDescription }: AdminHeaderProps) => {
  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-fitness-darkGray border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 dark:text-gray-400 p-1 sm:p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 text-center px-2">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
              {currentPageName || 'Admin Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Header for desktop */}
      <div className="hidden lg:flex items-center justify-between p-4 xl:p-6 bg-white dark:bg-fitness-darkGray border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white truncate">
            {currentPageName || 'Dashboard'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm xl:text-base truncate">
            {currentPageDescription || 'Welcome to your admin dashboard'}
          </p>
        </div>
        <div className="flex items-center gap-3 xl:gap-4 ml-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-48 xl:w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
