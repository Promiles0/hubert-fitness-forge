
import { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  Dumbbell,
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
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface ClassSchedule {
  id: string;
  start_time: string;
  end_time: string;
  day_of_week: number | null;
  class: {
    id: string;
    name: string;
    class_type: string;
    capacity: number;
    duration_minutes: number;
    room: string | null;
    trainer: {
      first_name: string;
      last_name: string;
    } | null;
  };
}

const ClassesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classTypeFilter, setClassTypeFilter] = useState<string | null>(null);
  const [trainerFilter, setTrainerFilter] = useState<string | null>(null);
  
  // Fetch class schedules with their class details and trainer
  const { data: classSchedules, isLoading, error, refetch } = useQuery({
    queryKey: ['class-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_schedules')
        .select(`
          id, 
          start_time, 
          end_time,
          day_of_week,
          class: class_id (
            id,
            name, 
            class_type, 
            capacity,
            duration_minutes,
            room,
            trainer: trainer_id (
              first_name,
              last_name
            )
          )
        `);
      
      if (error) throw error;
      return data as ClassSchedule[];
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
  const filteredClasses = classSchedules?.filter(schedule => {
    const searchMatch = 
      searchQuery === "" || 
      schedule.class.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (schedule.class.room && schedule.class.room.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const classTypeMatch = classTypeFilter === null || schedule.class.class_type === classTypeFilter;
    
    const trainerMatch = trainerFilter === null || 
      (schedule.class.trainer && 
       `${schedule.class.trainer.first_name} ${schedule.class.trainer.last_name}` === trainerFilter);
    
    return searchMatch && classTypeMatch && trainerMatch;
  });

  // Format time from ISO string
  const formatTime = (timeString: string) => {
    return format(parseISO(timeString), 'h:mm a');
  };

  // Get day name from day number (0 = Sunday, 6 = Saturday)
  const getDayName = (dayNumber: number | null) => {
    if (dayNumber === null) return "One-time";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
  };

  // Class type badge color mapping
  const getClassTypeColor = (type: string) => {
    switch (type) {
      case 'group': return 'bg-blue-500 hover:bg-blue-600';
      case 'personal': return 'bg-green-500 hover:bg-green-600';
      case 'specialty': return 'bg-purple-500 hover:bg-purple-600';
      case 'workshop': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Handle class deletion
  const handleDeleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Class deleted",
        description: "Class has been successfully deleted",
      });
      
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete class",
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
            <Calendar className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Loading Classes</h3>
            <p className="text-gray-400 mb-4">
              There was an error loading the class data. Please try again later.
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
    <div className="space-y-4 sm:space-y-6">
      {/* Classes Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Classes & Bookings</h2>
        
        <Button className="bg-fitness-red hover:bg-red-700 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Class
        </Button>
      </div>

      {/* Search and Filter */}
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

      {/* Classes Table */}
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-fitness-red" />
              <span className="ml-2 text-white">Loading classes...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-fitness-black">
                  <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                    <TableHead className="text-white text-xs sm:text-sm">Class Name</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm hidden sm:table-cell">Type</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm">Time</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm hidden md:table-cell">Day</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm hidden lg:table-cell">Trainer</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm hidden md:table-cell">Room</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm hidden sm:table-cell">Capacity</TableHead>
                    <TableHead className="text-white text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses && filteredClasses.length > 0 ? (
                    filteredClasses.map((schedule) => (
                      <TableRow key={schedule.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                        <TableCell className="text-white font-medium text-sm">
                          <div>
                            <div className="font-medium">{schedule.class.name}</div>
                            <div className="text-xs text-gray-400 sm:hidden">
                              {schedule.class.class_type} • {schedule.class.capacity} spots
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={getClassTypeColor(schedule.class.class_type)}>
                            {schedule.class.class_type.charAt(0).toUpperCase() + schedule.class.class_type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          <div>
                            <div>{formatTime(schedule.start_time)}</div>
                            <div className="text-xs text-gray-400">{formatTime(schedule.end_time)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm hidden md:table-cell">
                          {getDayName(schedule.day_of_week)}
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm hidden lg:table-cell">
                          {schedule.class.trainer 
                            ? `${schedule.class.trainer.first_name} ${schedule.class.trainer.last_name}` 
                            : "No Trainer"
                          }
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm hidden md:table-cell">
                          {schedule.class.room || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm hidden sm:table-cell">
                          {schedule.class.capacity}
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
                            <DropdownMenuContent align="end" className="bg-fitness-black border-gray-700 text-white z-50">
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Class</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <Users className="mr-2 h-4 w-4" />
                                <span>View Bookings</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Class</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-fitness-black border-gray-700 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Delete Class</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Are you sure you want to delete {schedule.class.name}? This will also delete all bookings for this class.
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
                                      onClick={() => handleDeleteClass(schedule.id)}
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
                      <TableCell colSpan={8} className="h-24 text-center text-white">
                        No classes found.
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

export default ClassesPage;
