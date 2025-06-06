
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
  const { user } = useAuth();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-fitness-darkGray border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-3">
              <Dumbbell className="h-8 w-8 text-fitness-red" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="text-fitness-red">HUBERT</span> FITNESS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-500 dark:text-gray-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full p-0 h-auto justify-start">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-fitness-red text-white">
                        {user?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
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
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? 'bg-fitness-red text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${item.active ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
