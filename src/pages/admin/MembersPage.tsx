
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
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  membership_plan: {
    name: string;
  } | null;
  trainer: {
    first_name: string;
    last_name: string;
  } | null;
  gender: string | null;
}

const MembersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [trainerFilter, setTrainerFilter] = useState<string | null>(null);
  
  const { hasRole } = useAuth();

  // Fetch members with their membership plans and trainers
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
          membership_plan: membership_plan_id (name),
          trainer: assigned_trainer_id (first_name, last_name)
        `);
      
      if (error) throw error;
      return data as Member[];
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

  // Apply filters and search
  const filteredMembers = members?.filter(member => {
    const searchMatch = 
      searchQuery === "" || 
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.includes(searchQuery));
    
    const statusMatch = statusFilter === null || member.status === statusFilter;
    const genderMatch = genderFilter === null || member.gender === genderFilter;
    const planMatch = planFilter === null || (member.membership_plan && member.membership_plan.name === planFilter);
    const trainerMatch = trainerFilter === null || 
      (member.trainer && `${member.trainer.first_name} ${member.trainer.last_name}` === trainerFilter);
    
    return searchMatch && statusMatch && genderMatch && planMatch && trainerMatch;
  });

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'suspended': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'expired': return 'bg-red-500 hover:bg-red-600';
      case 'pending': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Handle member deletion
  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Member deleted",
        description: "Member has been successfully deleted",
      });
      
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
      console.error(err);
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
        <h2 className="text-xl font-semibold text-white">Members Management</h2>
        
        <Button 
          className="bg-fitness-red hover:bg-red-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
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
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={planFilter || ""}
              onValueChange={(value) => setPlanFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Membership Plan" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="">All Plans</SelectItem>
                {membershipPlans?.map(plan => (
                  <SelectItem key={plan.id} value={plan.name}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={genderFilter || ""}
              onValueChange={(value) => setGenderFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={trainerFilter || ""}
              onValueChange={(value) => setTrainerFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Assigned Trainer" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="">All Trainers</SelectItem>
                {trainers?.map(trainer => (
                  <SelectItem 
                    key={trainer.id} 
                    value={`${trainer.first_name} ${trainer.last_name}`}
                  >
                    {trainer.first_name} {trainer.last_name}
                  </SelectItem>
                ))}
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
              <span className="ml-2 text-white">Loading members...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-fitness-black">
                  <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Plan</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Join Date</TableHead>
                    <TableHead className="text-white">Expiry Date</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers && filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                        <TableCell className="text-white font-medium">
                          {member.first_name} {member.last_name}
                        </TableCell>
                        <TableCell className="text-gray-300">{member.email}</TableCell>
                        <TableCell className="text-gray-300">
                          {member.membership_plan?.name || "No Plan"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {member.join_date ? format(new Date(member.join_date), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {member.expiry_date ? format(new Date(member.expiry_date), 'MMM dd, yyyy') : 'N/A'}
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
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>View Attendance</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Member</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-fitness-black border-gray-700 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Delete Member</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Are you sure you want to delete {member.first_name} {member.last_name}'s account? This action cannot be undone.
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
                                      onClick={() => handleDeleteMember(member.id)}
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
                      <TableCell colSpan={7} className="h-24 text-center text-white">
                        No members found.
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
