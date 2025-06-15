
import { Edit, Trash2, Users, Loader2 } from "lucide-react";
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
                            <DropdownMenuItem 
                              className="text-white hover:bg-fitness-darkGray cursor-pointer"
                              onClick={() => onEditClass(schedule)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Class</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-white hover:bg-fitness-darkGray cursor-pointer"
                              onClick={() => onViewBookings(schedule)}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              <span>View Bookings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem 
                              className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
                              onClick={() => onDeleteClass(schedule)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Class</span>
                            </DropdownMenuItem>
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
  );
};

export default AdminClassesTable;
