
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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-white text-base sm:text-lg">
          <Filter className="inline mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by class name or room..."
              className="bg-fitness-black border-gray-700 pl-10 text-white w-full"
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
            <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
              <SelectValue placeholder="Class Type" />
            </SelectTrigger>
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="group">Group Class</SelectItem>
              <SelectItem value="personal">Personal Training</SelectItem>
              <SelectItem value="specialty">Specialty Class</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={trainerFilter || ""}
            onValueChange={(value) => setTrainerFilter(value || null)}
          >
            <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
              <SelectValue placeholder="Trainer" />
            </SelectTrigger>
            <SelectContent className="bg-fitness-black border-gray-700 text-white z-50">
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

export default ClassesFilters;
