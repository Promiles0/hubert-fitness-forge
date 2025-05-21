
import { Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MembersFilterProps } from "./types";

export const MembersFilter = ({
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
}: MembersFilterProps) => {
  return (
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
  );
};
