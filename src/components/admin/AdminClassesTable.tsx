
import { Edit, Trash2, Users, Loader2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface AdminClassesTableProps {
  filteredClasses: ClassSchedule[] | undefined;
  isLoading: boolean;
  onEditClass: (schedule: ClassSchedule) => void;
  onDeleteClass: (schedule: ClassSchedule) => void;
  onViewBookings: (schedule: ClassSchedule) => void;
}

const AdminClassesTable = ({
  filteredClasses,
  isLoading,
  onEditClass,
  onDeleteClass,
  onViewBookings
}: AdminClassesTableProps) => {
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

  return (
    <Card className="bg-fitness-darkGray border-gray-800">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center p-6 sm:p-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-fitness-red" />
            <span className="ml-2 text-white text-sm sm:text-base">Loading classes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-fitness-black">
                <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4">Class</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4 hidden lg:table-cell">Type</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4">Schedule</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4 hidden md:table-cell">Trainer</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4 hidden xl:table-cell">Room</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4 hidden sm:table-cell">Capacity</TableHead>
                  <TableHead className="text-white text-xs sm:text-sm font-medium px-2 sm:px-4 w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses && filteredClasses.length > 0 ? (
                  filteredClasses.map((schedule) => (
                    <TableRow key={schedule.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                      <TableCell className="text-white font-medium text-xs sm:text-sm px-2 sm:px-4">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{schedule.class.name}</div>
                          <div className="text-xs text-gray-400 lg:hidden mt-1">
                            <Badge className={`${getClassTypeColor(schedule.class.class_type)} text-xs mr-2`}>
                              {schedule.class.class_type}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400 sm:hidden mt-1">
                            {schedule.class.capacity} spots
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-2 sm:px-4">
                        <Badge className={getClassTypeColor(schedule.class.class_type)}>
                          {schedule.class.class_type.charAt(0).toUpperCase() + schedule.class.class_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm px-2 sm:px-4">
                        <div className="min-w-0">
                          <div className="truncate">{formatTime(schedule.start_time)}</div>
                          <div className="text-xs text-gray-400 truncate">{formatTime(schedule.end_time)}</div>
                          <div className="text-xs text-gray-400 md:hidden mt-1">
                            {getDayName(schedule.day_of_week)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell px-2 sm:px-4">
                        <div className="truncate max-w-32">
                          {schedule.class.trainer 
                            ? `${schedule.class.trainer.first_name} ${schedule.class.trainer.last_name}` 
                            : "No Trainer"
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm hidden xl:table-cell px-2 sm:px-4">
                        <div className="truncate">
                          {schedule.class.room || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell px-2 sm:px-4">
                        {schedule.class.capacity}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-fitness-black border-gray-700 text-white z-50 w-40">
                            <DropdownMenuItem 
                              className="text-white hover:bg-fitness-darkGray cursor-pointer text-xs sm:text-sm"
                              onClick={() => onEditClass(schedule)}
                            >
                              <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span>Edit Class</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-white hover:bg-fitness-darkGray cursor-pointer text-xs sm:text-sm"
                              onClick={() => onViewBookings(schedule)}
                            >
                              <Users className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span>View Bookings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem 
                              className="text-red-500 hover:bg-fitness-darkGray cursor-pointer text-xs sm:text-sm"
                              onClick={() => onDeleteClass(schedule)}
                            >
                              <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span>Delete Class</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-16 sm:h-24 text-center text-white text-sm">
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
  );
};

export default AdminClassesTable;
