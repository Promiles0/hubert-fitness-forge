
import { useState } from "react";
import { UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MembersFilter } from "./MembersFilter";
import { MembersTable } from "./MembersTable";
import { useMembers, useMembershipPlans, useTrainers } from "./hooks/useMembers";
import { getStatusColor } from "./utils/memberUtils";
import { Member } from "./types";

const MembersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [trainerFilter, setTrainerFilter] = useState<string | null>(null);
  
  const { members, isLoading, error, refetch } = useMembers();
  const { data: membershipPlans } = useMembershipPlans();
  const { data: trainers } = useTrainers();

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
    
    const trainerName = member.trainer ? `${member.trainer.first_name} ${member.trainer.last_name}` : '';
    const trainerMatch = trainerFilter === null || trainerName === trainerFilter;
    
    return searchMatch && statusMatch && genderMatch && planMatch && trainerMatch;
  });

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
      <MembersFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        trainerFilter={trainerFilter}
        setTrainerFilter={setTrainerFilter}
        membershipPlans={membershipPlans}
        trainers={trainers}
      />

      {/* Members Table */}
      <MembersTable 
        members={filteredMembers}
        isLoading={isLoading}
        getStatusColor={getStatusColor}
        handleDeleteMember={handleDeleteMember}
      />
    </div>
  );
};

export default MembersPage;
