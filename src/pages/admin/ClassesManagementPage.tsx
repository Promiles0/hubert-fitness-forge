
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddClassDialog from "@/components/admin/AddClassDialog";
import EditClassDialog from "@/components/admin/EditClassDialog";
import DeleteClassDialog from "@/components/admin/DeleteClassDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ClassesManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch classes with schedules and trainers
  const { data: classes, isLoading } = useQuery({
    queryKey: ['admin-classes', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('classes')
        .select(`
          *,
          trainers (
            first_name,
            last_name
          ),
          class_schedules (
            id,
            start_time,
            end_time,
            day_of_week
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch bookings count for each class schedule
  const { data: bookingsCounts } = useQuery({
    queryKey: ['admin-bookings-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('class_schedule_id')
        .eq('status', 'confirmed');

      if (error) throw error;

      // Count bookings per class schedule
      const counts: Record<string, number> = {};
      data.forEach(booking => {
        if (booking.class_schedule_id) {
          counts[booking.class_schedule_id] = (counts[booking.class_schedule_id] || 0) + 1;
        }
      });

      return counts;
    },
  });

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

  const handleEditClass = (classItem: any) => {
    console.log('Edit class clicked:', classItem);
    setSelectedClass(classItem);
    setShowEditDialog(true);
  };

  const handleDeleteClass = (classItem: any) => {
    console.log('Delete class clicked:', classItem);
    setSelectedClass(classItem);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedClass) return;

    try {
      // First delete all class schedules
      const { error: scheduleError } = await supabase
        .from('class_schedules')
        .delete()
        .eq('class_id', selectedClass.id);

      if (scheduleError) throw scheduleError;

      // Then delete the class
      const { error: classError } = await supabase
        .from('classes')
        .delete()
        .eq('id', selectedClass.id);

      if (classError) throw classError;

      toast.success(`Class "${selectedClass.name}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      setShowDeleteDialog(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage fitness classes and schedules
          </p>
        </div>
        <Button 
          className="bg-fitness-red hover:bg-red-700"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {classes?.length || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {classes?.reduce((sum, cls) => sum + (cls.capacity || 0), 0) || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {Object.values(bookingsCounts || {}).reduce((sum, count) => sum + count, 0)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {classes?.filter(cls => cls.class_schedules && cls.class_schedules.length > 0).length || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
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
                          onClick={() => handleEditClass(classItem)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClass(classItem)}
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

      <AddClassDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />

      <EditClassDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        classData={selectedClass}
      />

      <DeleteClassDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        className={selectedClass?.name || ''}
      />
    </div>
  );
};

export default ClassesManagementPage;
