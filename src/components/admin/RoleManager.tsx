import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Shield, X, Check } from "lucide-react";

type UserRole = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
};

type UserWithRoles = {
  id: string;
  email: string;
  roles: string[];
};

// Define the role type to match the Supabase enum
type AppRole = "admin" | "member" | "trainer" | "staff";

const RoleManager = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("member");
  const availableRoles: AppRole[] = ["admin", "member", "trainer", "staff"];

  // Fetch users and their roles
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users from auth.users table using profiles as a proxy
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id');
          
        if (profilesError) throw profilesError;
        
        if (!profilesData || profilesData.length === 0) {
          setUsers([]);
          return;
        }
        
        // For each user ID, fetch the user details and roles
        const usersWithRoles = await Promise.all(
          profilesData.map(async (profile) => {
            // Get user email from auth (need to use admin functions in a real app)
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('id, name')
              .eq('id', profile.id)
              .single();
              
            if (userError) throw userError;
            
            // Get user roles
            const { data: rolesData, error: rolesError } = await supabase
              .rpc('get_user_roles', { _user_id: profile.id });
              
            if (rolesError) throw rolesError;
            
            return {
              id: profile.id,
              email: userData.name || profile.id, // Use name as display or fallback to ID
              roles: rolesData as string[] || []
            };
          })
        );
        
        setUsers(usersWithRoles);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error loading users",
          description: "There was a problem fetching the user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Assign role to user
  const assignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      // Check if user already has the role
      const targetUser = users.find(user => user.id === selectedUser);
      if (targetUser && targetUser.roles.includes(selectedRole)) {
        toast({
          title: "Role already assigned",
          description: `User already has the ${selectedRole} role.`,
        });
        return;
      }
      
      // Insert the role - fixed to properly match the Supabase types
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser,
          role: selectedRole
        });
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === selectedUser) {
            return {
              ...user,
              roles: [...user.roles, selectedRole]
            };
          }
          return user;
        })
      );
      
      toast({
        title: "Role assigned",
        description: `Successfully assigned ${selectedRole} role to user.`,
      });
    } catch (error: any) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error assigning role",
        description: error.message || "There was a problem assigning the role.",
        variant: "destructive",
      });
    }
  };

  // Remove role from user
  const removeRole = async (userId: string, role: string) => {
    try {
      // Ensure the role is a valid AppRole
      if (!availableRoles.includes(role as AppRole)) {
        throw new Error(`Invalid role: ${role}`);
      }

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, role });
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              roles: user.roles.filter(r => r !== role)
            };
          }
          return user;
        })
      );
      
      toast({
        title: "Role removed",
        description: `Successfully removed ${role} role from user.`,
      });
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast({
        title: "Error removing role",
        description: error.message || "There was a problem removing the role.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-fitness-darkGray border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Assign or remove user roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search Users */}
          <div>
            <Label htmlFor="search-user" className="text-white">Search Users</Label>
            <Input
              id="search-user"
              placeholder="Search by email or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-fitness-black border-gray-700 text-white"
            />
          </div>
          
          {/* Assign Role Form */}
          <div className="flex flex-col gap-4 md:flex-row items-end">
            <div className="flex-1">
              <Label htmlFor="select-user" className="text-white">Select User</Label>
              <Select value={selectedUser || ""} onValueChange={setSelectedUser}>
                <SelectTrigger id="select-user" className="bg-fitness-black border-gray-700 text-white">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="bg-fitness-black border-gray-700 text-white">
                  {filteredUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="select-role" className="text-white">Select Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                <SelectTrigger id="select-role" className="bg-fitness-black border-gray-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-fitness-black border-gray-700 text-white">
                  {availableRoles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={assignRole} 
              disabled={!selectedUser || !selectedRole}
              className="bg-fitness-red hover:bg-red-700 text-white"
            >
              Assign Role
            </Button>
          </div>
          
          {/* Users with Roles List */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Users & Roles</h3>
            {isLoading ? (
              <p className="text-gray-400">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-400">No users found</p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-fitness-black p-4 rounded-md border border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length === 0 ? (
                        <span className="text-gray-500 text-sm">No roles assigned</span>
                      ) : (
                        user.roles.map(role => (
                          <span key={role} className="inline-flex items-center bg-fitness-red/20 text-red-300 px-2 py-1 rounded text-xs">
                            {role}
                            <button 
                              onClick={() => removeRole(user.id, role)}
                              className="ml-1 hover:text-white"
                              aria-label={`Remove ${role} role`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManager;
