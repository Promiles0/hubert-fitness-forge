
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleManager from "@/components/admin/RoleManager";
import { Settings, Shield, User, Bell } from "lucide-react";

const AdminSettingsPage = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has admin permissions
  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast({
        title: "Access Denied",
        description: "Please login to access the admin settings",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasRole('admin')) {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You do not have permission to access admin settings",
        variant: "destructive",
      });
    }
  }, [user, hasRole, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Settings & Customization</h2>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="bg-fitness-black border border-gray-800 text-gray-400">
          <TabsTrigger value="roles" className="data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            <Shield className="mr-2 h-4 w-4" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            <User className="mr-2 h-4 w-4" />
            Admin Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="mt-6">
          <RoleManager />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card className="bg-fitness-darkGray border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your admin account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Admin profile settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-fitness-darkGray border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Notification settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="mt-6">
          <Card className="bg-fitness-darkGray border-gray-800 text-white">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">General settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;
