
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Apple, 
  MessageSquare, 
  Settings, 
  User,
  LogOut,
  Menu,
  X,
  Dumbbell,
  Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('Member');

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Classes", href: "/dashboard/classes", icon: Users },
    { name: "Nutrition", href: "/dashboard/nutrition", icon: Apple },
    { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          
          // Handle avatar URL
          if (profileData.avatar) {
            if (profileData.avatar.startsWith('http')) {
              setAvatarUrl(profileData.avatar);
            } else if (profileData.avatar.includes('avatars/')) {
              const fileName = profileData.avatar.split('avatars/')[1];
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
              setAvatarUrl(data.publicUrl);
            } else {
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(profileData.avatar);
              setAvatarUrl(data.publicUrl);
            }
          }
        }

        // Check user roles
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (roleData && roleData.length > 0) {
          setUserRole(roleData[0].role.charAt(0).toUpperCase() + roleData[0].role.slice(1));
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.name) {
      return profile.name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUsername = () => {
    if (profile?.username) {
      return `@${profile.username}`;
    }
    return user?.email?.split('@')[0] || 'user';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-fitness-dark flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-fitness-darkGray border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-fitness-red" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                <span className="text-fitness-red">HUBERT</span> FITNESS
              </h1>
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <ThemeToggle size="sm" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Profile Header */}
          <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full p-0 h-auto justify-start">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="bg-fitness-red text-white text-sm lg:text-base">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {getUsername()}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1 bg-fitness-red/20 text-fitness-red border-0">
                        {userRole}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-fitness-red text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-fitness-darkGray border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-fitness-dark">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
