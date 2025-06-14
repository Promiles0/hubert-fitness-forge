
import { useState } from "react";
import { UserPlus, Shield } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { MembersStatsCards } from "@/components/admin/MembersStatsCards";
import { MembersSearchFilters } from "@/components/admin/MembersSearchFilters";
import { MembersTable } from "@/components/admin/MembersTable";

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
          assigned_trainer_id,
          membership_plan_id
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

      // Fetch membership plans
      const planIds = data.filter(m => m.membership_plan_id).map(m => m.membership_plan_id);
      let plans = [];
      if (planIds.length > 0) {
        const { data: plansData } = await supabase
          .from('membership_plans')
          .select('id, name')
          .in('id', planIds);
        plans = plansData || [];
      }

      // Fetch trainers
      const trainerIds = data.filter(m => m.assigned_trainer_id).map(m => m.assigned_trainer_id);
      let trainers = [];
      if (trainerIds.length > 0) {
        const { data: trainersData } = await supabase
          .from('trainers')
          .select('id, first_name, last_name')
          .in('id', trainerIds);
        trainers = trainersData || [];
      }

      // Combine member data with profiles and ensure proper typing
      const enrichedMembers = data.map(member => ({
        ...member,
        profile: profiles.find(p => p.id === member.user_id),
        membership_plan: plans.find(p => p.id === member.membership_plan_id) || null,
        trainer: trainers.find(t => t.id === member.assigned_trainer_id) || null
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

  const handleBlockToggle = (memberId: string, block: boolean) => {
    blockUserMutation.mutate({ memberId, block });
  };

  const handleDelete = (memberId: string) => {
    deleteUserMutation.mutate(memberId);
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
        
        <Button className="bg-fitness-red hover:bg-red-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <MembersStatsCards members={members} />

      {/* Search and Filter */}
      <MembersSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        membershipPlans={membershipPlans}
      />

      {/* Members Table */}
      <MembersTable
        members={filteredMembers}
        isLoading={isLoading}
        onBlockToggle={handleBlockToggle}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MembersPage;
