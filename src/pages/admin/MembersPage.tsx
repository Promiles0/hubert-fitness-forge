import { useState, useEffect } from "react";
import { 
  Search, 
  UserPlus, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar, 
  Shield, 
  Loader2,
  UserX,
  UserCheck
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  join_date: string;
  expiry_date: string | null;
  is_blocked: boolean;
  user_id: string | null;
  membership_plan: {
    name: string;
  } | null;
  trainer: {
    first_name: string;
    last_name: string;
  } | null;
  gender: string | null;
  profile?: {
    avatar?: string;
  };
}

const MembersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [trainerFilter, setTrainerFilter] = useState<string | null>(null);
  
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();

  // Fetch members with their membership plans, trainers, and profiles
  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id, 
          first_name, 
          last_name, 
          email, 
          phone, 
          status, 
          join_date, 
          expiry_date, 
          gender,
          is_blocked,
          user_id,
          membership_plan:membership_plan_id(name),
          trainer:assigned_trainer_id(first_name, last_name)
        `);
      
      if (error) throw error;

      // Fetch profiles for avatars
      const userIds = data.filter(m => m.user_id).map(m => m.user_id);
      let profiles = [];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, avatar')
          .in('id', userIds);
        profiles = profilesData || [];
      }

      // Combine member data with profiles and ensure proper typing
      const enrichedMembers = data.map(member => ({
        ...member,
        profile: profiles.find(p => p.id === member.user_id),
        membership_plan: member.membership_plan ? { name: member.membership_plan.name } : null,
        trainer: member.trainer ? { 
          first_name: member.trainer.first_name, 
          last_name: member.trainer.last_name 
        } : null
      }));

      return enrichedMembers as Member[];
    },
  });

  // Fetch membership plans for filter dropdown
  const { data: membershipPlans } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('id, name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch trainers for filter dropdown
  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Block/Unblock user mutation
  const blockUserMutation = useMutation({
    mutationFn: async ({ memberId, block }: { memberId: string; block: boolean }) => {
      const { error } = await supabase
        .from('members')
        .update({ is_blocked: block })
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: (_, { block }) => {
      toast({
        title: "Success",
        description: `User ${block ? 'blocked' : 'unblocked'} successfully`,
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user status: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete user: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Apply filters and search
  const filteredMembers = members?.filter(member => {
    const searchMatch = 
      searchQuery === "" || 
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery));
    
    const statusMatch = statusFilter === null || statusFilter === "all" || member.status === statusFilter;
    const genderMatch = genderFilter === null || genderFilter === "all" || member.gender === genderFilter;
    const planMatch = planFilter === null || planFilter === "all" || 
      (member.membership_plan && member.membership_plan.name === planFilter);
    
    const trainerMatch = trainerFilter === null || trainerFilter === "all" || 
      (member.trainer && 
       `${member.trainer.first_name} ${member.trainer.last_name}` === trainerFilter);
    
    return searchMatch && statusMatch && genderMatch && planMatch && trainerMatch;
  });

  // Status badge color mapping
  const getStatusColor = (status: string, isBlocked: boolean) => {
    if (isBlocked) return 'bg-red-500 hover:bg-red-600';
    switch (status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'suspended': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'expired': return 'bg-red-500 hover:bg-red-600';
      case 'pending': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (error) {
    return (
      <Card className="bg-fitness-darkGray border-gray-800 text-white mx-auto max-w-4xl my-8">
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Loading Members</h3>
            <p className="text-gray-400 mb-4">
              There was an error loading the member data. Please try again later.
            </p>
            <Button 
              variant="outline" 
              className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Members Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">User Management</h2>
        
        <Button 
          className="bg-fitness-red hover:bg-red-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-500">
              {members?.filter(m => m.status === 'active' && !m.is_blocked).length || 0}
            </div>
            <p className="text-sm text-gray-400">Active Users</p>
          </CardContent>
        </Card>
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-500">
              {members?.length || 0}
            </div>
            <p className="text-sm text-gray-400">Total Users</p>
          </CardContent>
        </Card>
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-500">
              {members?.filter(m => m.is_blocked).length || 0}
            </div>
            <p className="text-sm text-gray-400">Blocked Users</p>
          </CardContent>
        </Card>
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-500">
              {members?.filter(m => m.trainer).length || 0}
            </div>
            <p className="text-sm text-gray-400">With Trainers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            <Filter className="inline mr-2 h-5 w-5" /> 
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email or phone..."
                  className="bg-fitness-black border-gray-700 pl-10 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value === "" ? null : value)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={planFilter || ""}
              onValueChange={(value) => setPlanFilter(value === "" ? null : value)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Membership Plan" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="all">All Plans</SelectItem>
                {membershipPlans?.map(plan => (
                  <SelectItem key={plan.id} value={plan.name}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={genderFilter || ""}
              onValueChange={(value) => setGenderFilter(value === "" ? null : value)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-fitness-red" />
              <span className="ml-2 text-white">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-fitness-black">
                  <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                    <TableHead className="text-white">User</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Plan</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Join Date</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers && filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                        <TableCell className="text-white font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.profile?.avatar} />
                              <AvatarFallback className="bg-fitness-red text-white">
                                {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.first_name} {member.last_name}</div>
                              <div className="text-sm text-gray-400">ID: {member.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{member.email}</TableCell>
                        <TableCell className="text-gray-300">
                          {member.membership_plan?.name || "No Plan"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.status, member.is_blocked)}>
                            {member.is_blocked ? 'Blocked' : member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {member.join_date ? format(new Date(member.join_date), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-white">
                                <span className="sr-only">Open menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-fitness-black border-gray-700 text-white">
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>View Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Info</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem 
                                className="text-white hover:bg-fitness-darkGray cursor-pointer"
                                onClick={() => blockUserMutation.mutate({ 
                                  memberId: member.id, 
                                  block: !member.is_blocked 
                                })}
                              >
                                {member.is_blocked ? (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span>Unblock User</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    <span>Block User</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete User</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-fitness-black border-gray-700 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Delete User</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Are you sure you want to permanently delete {member.first_name} {member.last_name}'s account? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      className="border-gray-700 text-white hover:bg-gray-800"
                                      onClick={() => {}}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                      onClick={() => deleteUserMutation.mutate(member.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-white">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersPage;
