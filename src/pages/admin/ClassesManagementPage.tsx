
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddClassDialog from "@/components/admin/AddClassDialog";
import EditClassDialog from "@/components/admin/EditClassDialog";
import DeleteClassDialog from "@/components/admin/DeleteClassDialog";
import ClassBookingsDialog from "@/components/admin/ClassBookingsDialog";
import ClassesStatsCards from "@/components/admin/ClassesStatsCards";
import ClassesSearchBar from "@/components/admin/ClassesSearchBar";
import ClassesTable from "@/components/admin/ClassesTable";

const ClassesManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBookingsDialog, setShowBookingsDialog] = useState(false);
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

  const handleViewBookings = (classItem: any) => {
    console.log('View bookings clicked:', classItem);
    setSelectedClass(classItem);
    setShowBookingsDialog(true);
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
      <ClassesStatsCards classes={classes || []} />

      {/* Search */}
      <ClassesSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Classes Table */}
      <ClassesTable
        classes={classes || []}
        bookingsCounts={bookingsCounts}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClass}
        onViewBookings={handleViewBookings}
      />

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

      <ClassBookingsDialog
        open={showBookingsDialog}
        onOpenChange={setShowBookingsDialog}
        classData={selectedClass}
      />
    </div>
  );
};

export default ClassesManagementPage;
