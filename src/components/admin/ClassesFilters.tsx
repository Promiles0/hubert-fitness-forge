
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

interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
}

interface ClassesFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  classTypeFilter: string | null;
  setClassTypeFilter: (filter: string | null) => void;
  trainerFilter: string | null;
  setTrainerFilter: (filter: string | null) => void;
  trainers: Trainer[] | undefined;
}

const ClassesFilters = ({
  searchQuery,
  setSearchQuery,
  classTypeFilter,
  setClassTypeFilter,
  trainerFilter,
  setTrainerFilter,
  trainers
}: ClassesFiltersProps) => {
  return (
    <Card className="bg-fitness-darkGray border-gray-800">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-white text-sm sm:text-base lg:text-lg">
          <Filter className="inline mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Search Input */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by class name or room..."
              className="bg-fitness-black border-gray-700 pl-8 sm:pl-10 text-white w-full text-sm sm:text-base h-9 sm:h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select
            value={classTypeFilter || ""}
            onValueChange={(value) => setClassTypeFilter(value || null)}
          >
            <SelectTrigger className="bg-fitness-black border-gray-700 text-white h-9 sm:h-10 text-sm sm:text-base">
              <SelectValue placeholder="Class Type" />
            </SelectTrigger>
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
              <SelectItem value="" className="text-sm">All Types</SelectItem>
              <SelectItem value="group" className="text-sm">Group Class</SelectItem>
              <SelectItem value="personal" className="text-sm">Personal Training</SelectItem>
              <SelectItem value="specialty" className="text-sm">Specialty Class</SelectItem>
              <SelectItem value="workshop" className="text-sm">Workshop</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={trainerFilter || ""}
            onValueChange={(value) => setTrainerFilter(value || null)}
          >
            <SelectTrigger className="bg-fitness-black border-gray-700 text-white h-9 sm:h-10 text-sm sm:text-base">
              <SelectValue placeholder="Trainer" />
            </SelectTrigger>
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50 max-h-60">
              <SelectItem value="" className="text-sm">All Trainers</SelectItem>
              {trainers?.map(trainer => (
                <SelectItem 
                  key={trainer.id} 
                  value={`${trainer.first_name} ${trainer.last_name}`}
                  className="text-sm"
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

export default ClassesFilters;
