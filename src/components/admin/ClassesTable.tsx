
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Users,
  Edit,
  Trash2,
  UserCheck,
} from "lucide-react";

interface ClassesTableProps {
  classes: any[];
  bookingsCounts: Record<string, number> | undefined;
  onEditClass: (classItem: any) => void;
  onDeleteClass: (classItem: any) => void;
  onViewBookings: (classItem: any) => void;
}

const ClassesTable = ({ 
  classes, 
  bookingsCounts, 
  onEditClass, 
  onDeleteClass, 
  onViewBookings 
}: ClassesTableProps) => {
  const getClassTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'yoga': return 'bg-purple-100 text-purple-800';
      case 'hiit': return 'bg-red-100 text-red-800';
      case 'cardio': return 'bg-blue-100 text-blue-800';
      case 'strength': return 'bg-green-100 text-green-800';
      case 'pilates': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  const getBookingStatus = (classItem: any) => {
    if (!classItem.class_schedules || classItem.class_schedules.length === 0) {
      return { totalBookings: 0, isFullyBooked: false, availableSpots: classItem.capacity };
    }

    const totalBookings = classItem.class_schedules.reduce((total, schedule) => 
      total + (bookingsCounts?.[schedule.id] || 0), 0
    );

    const isFullyBooked = totalBookings >= classItem.capacity;
    const availableSpots = Math.max(0, classItem.capacity - totalBookings);

    return { totalBookings, isFullyBooked, availableSpots };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classes List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes?.map((classItem) => {
              const bookingStatus = getBookingStatus(classItem);
              return (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{classItem.name}</div>
                      <div className="text-sm text-gray-500">
                        {classItem.duration_minutes} minutes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getClassTypeColor(classItem.class_type)}>
                      {classItem.class_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {classItem.trainers ? 
                      `${classItem.trainers.first_name} ${classItem.trainers.last_name}` : 
                      'No Trainer'
                    }
                  </TableCell>
                  <TableCell>
                    {classItem.class_schedules && classItem.class_schedules.length > 0 ? (
                      <div className="space-y-1">
                        {classItem.class_schedules.map((schedule, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {getDayName(schedule.day_of_week)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No Schedule</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {classItem.capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        <span className="font-medium">
                          {bookingStatus.totalBookings}/{classItem.capacity}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {bookingStatus.isFullyBooked ? (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Fully Booked
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {bookingStatus.availableSpots} spots left
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewBookings(classItem)}
                        className="hover:bg-blue-100 hover:text-blue-600"
                        title="View bookings"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditClass(classItem)}
                        className="hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteClass(classItem)}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClassesTable;
