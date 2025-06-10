
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Search, Settings, Users, Shield, Building, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessSettingsForm from "@/components/admin/BusinessSettingsForm";
import ActivityLogsViewer from "@/components/admin/ActivityLogsViewer";

const SettingsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      // First get profiles
      let profilesQuery = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        profilesQuery = profilesQuery.or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }

      const { data: profilesData, error: profilesError } = await profilesQuery;
      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Combine the data
      const enrichedProfiles = profilesData?.map(profile => {
        const userRoles = rolesData?.filter(role => role.user_id === profile.id) || [];
        
        return {
          ...profile,
          user_roles: userRoles
        };
      });

      return enrichedProfiles;
    },
  });

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage system settings, user roles, and configuration
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6">
          <BusinessSettingsForm />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          {/* Settings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{users?.length || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin Users</p>
                    <p className="text-2xl font-bold text-red-600">
                      {users?.filter(u => u.user_roles?.some((r: any) => r.role === 'admin')).length || 0}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
                    <p className="text-2xl font-bold text-green-600">Active</p>
                  </div>
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users & Roles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users & Roles</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>
                              {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {user.username || 'No username'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.phone && (
                            <div>📞 {user.phone}</div>
                          )}
                          {!user.phone && (
                            <span className="text-gray-500">No contact info</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.user_roles && user.user_roles.length > 0 ? (
                            user.user_roles.map((roleObj: any, index: number) => (
                              <Badge 
                                key={index}
                                className={
                                  roleObj.role === 'admin' ? 'bg-red-100 text-red-800' :
                                  roleObj.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {roleObj.role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">member</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Edit Roles
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityLogsViewer />
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced System Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced system configuration options will be available in future updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagementPage;
