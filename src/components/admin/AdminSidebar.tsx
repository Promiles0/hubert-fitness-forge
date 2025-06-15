
import { useState } from "react";
import { Link } from "react-router-dom";
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
  LogOut,
  X,
  Dumbbell,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminSidebarProps {
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
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, navigation, onLogout }: AdminSidebarProps) => {
  const { user, profile } = useAuth();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white dark:bg-fitness-darkGray border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-fitness-red flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  <span className="text-fitness-red">HUBERT</span> FITNESS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-500 dark:text-gray-400 p-1 flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full p-0 h-auto justify-start">
                  <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={profile?.avatar} />
                      <AvatarFallback className="bg-fitness-red text-white">
                        {profile?.name?.charAt(0) || profile?.username?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {profile?.name || profile?.username || 'Admin'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
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
                <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? 'bg-fitness-red text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className={`text-xs hidden sm:block ${item.active ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
