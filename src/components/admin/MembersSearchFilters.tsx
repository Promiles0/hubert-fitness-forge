
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembershipPlan {
  id: string;
  name: string;
}

interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
}

interface MembersSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  planFilter: string | null;
  setPlanFilter: (plan: string | null) => void;
  genderFilter: string | null;
  setGenderFilter: (gender: string | null) => void;
  trainerFilter?: string | null;
  setTrainerFilter?: (trainer: string | null) => void;
  membershipPlans: MembershipPlan[] | undefined;
  trainers?: Trainer[] | undefined;
}

export const MembersSearchFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  genderFilter,
  setGenderFilter,
  trainerFilter,
  setTrainerFilter,
  membershipPlans,
  trainers
}: MembersSearchFiltersProps) => {
  return (
    <Card className="bg-fitness-darkGray border-gray-800">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-white text-base sm:text-lg">
          <Filter className="inline mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input - Full width on mobile */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, email or phone..."
              className="bg-fitness-black border-gray-700 pl-10 text-white w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <Select
            value={statusFilter || ""}
            onValueChange={(value) => setStatusFilter(value || null)}
          >
            <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={planFilter || ""}
            onValueChange={(value) => setPlanFilter(value || null)}
          >
            <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
              <SelectItem value="all">All Plans</SelectItem>
              {membershipPlans?.map((plan) => (
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
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {setTrainerFilter && (
            <Select
              value={trainerFilter || ""}
              onValueChange={(value) => setTrainerFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Trainer" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
                <SelectItem value="all">All Trainers</SelectItem>
                {trainers?.map((trainer) => (
                  <SelectItem key={trainer.id} value={`${trainer.first_name} ${trainer.last_name}`}>
                    {trainer.first_name} {trainer.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
