
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ClassesHeader from "@/components/admin/ClassesHeader";
import ClassesFilters from "@/components/admin/ClassesFilters";
import AdminClassesTable from "@/components/admin/AdminClassesTable";
import AdminClassDeleteDialog from "@/components/admin/AdminClassDeleteDialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  
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

  // Handle class deletion
  const handleDeleteClass = async () => {
    if (!selectedClass) return;

    try {
      const { error } = await supabase
        .from('class_schedules')
        .delete()
        .eq('id', selectedClass.id);
      
      if (error) throw error;
      
      toast({
        title: "Class deleted",
        description: "Class has been successfully deleted",
      });
      
      refetch();
      setDeleteDialogOpen(false);
      setSelectedClass(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleAddClass = () => {
    // TODO: Implement add class functionality
    console.log("Add class functionality to be implemented");
  };

  const handleEditClass = (schedule: ClassSchedule) => {
    // TODO: Implement edit class functionality
    console.log("Edit class functionality to be implemented", schedule);
  };

  const handleViewBookings = (schedule: ClassSchedule) => {
    // TODO: Implement view bookings functionality
    console.log("View bookings functionality to be implemented", schedule);
  };

  const handleDeleteClassClick = (schedule: ClassSchedule) => {
    setSelectedClass(schedule);
    setDeleteDialogOpen(true);
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
      <ClassesHeader onAddClass={handleAddClass} />
      
      <ClassesFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        classTypeFilter={classTypeFilter}
        setClassTypeFilter={setClassTypeFilter}
        trainerFilter={trainerFilter}
        setTrainerFilter={setTrainerFilter}
        trainers={trainers}
      />

      <AdminClassesTable
        filteredClasses={filteredClasses}
        isLoading={isLoading}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClassClick}
        onViewBookings={handleViewBookings}
      />

      <AdminClassDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedClass={selectedClass}
        onConfirmDelete={handleDeleteClass}
      />
    </div>
  );
};

export default ClassesPage;
