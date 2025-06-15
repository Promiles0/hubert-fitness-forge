
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddClassFormFields from "./AddClassFormFields";
import TrainerSelector from "./TrainerSelector";
import ClassScheduleSection from "./ClassScheduleSection";

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: any;
}

const EditClassDialog = ({ open, onOpenChange, classData }: EditClassDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    class_type: '',
    capacity: '',
    duration_minutes: '',
    room: '',
    trainer_id: '',
  });
  
  const [scheduleData, setScheduleData] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (classData && open) {
      console.log('Setting form data with classData:', classData);
      setFormData({
        name: classData.name || '',
        description: classData.description || '',
        class_type: classData.class_type || '',
        capacity: classData.capacity?.toString() || '',
        duration_minutes: classData.duration_minutes?.toString() || '',
        room: classData.room || '',
        trainer_id: classData.trainer_id || '',
      });
      
      // Set schedule data if available
      if (classData.class_schedules && classData.class_schedules.length > 0) {
        const schedule = classData.class_schedules[0];
        console.log('Setting schedule data:', schedule);
        setScheduleData({
          day_of_week: schedule.day_of_week?.toString() || '',
          start_time: schedule.start_time?.substring(0, 5) || '',
          end_time: schedule.end_time?.substring(0, 5) || '',
        });
      } else {
        // Reset schedule data if no schedules
        setScheduleData({
          day_of_week: '',
          start_time: '',
          end_time: '',
        });
      }
    }
  }, [classData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting class update with data:', {
        formData,
        scheduleData,
        classId: classData.id
      });

      // Update the class
      const { error: classError } = await supabase
        .from('classes')
        .update({
          name: formData.name,
          description: formData.description,
          class_type: formData.class_type as any,
          capacity: parseInt(formData.capacity),
          duration_minutes: parseInt(formData.duration_minutes),
          room: formData.room,
          trainer_id: formData.trainer_id || null,
        })
        .eq('id', classData.id);

      if (classError) {
        console.error('Class update error:', classError);
        throw classError;
      }

      // Handle schedule updates
      if (scheduleData.day_of_week && scheduleData.start_time && scheduleData.end_time) {
        console.log('Updating schedule with data:', scheduleData);
        
        // First, delete existing schedules for this class
        const { error: deleteError } = await supabase
          .from('class_schedules')
          .delete()
          .eq('class_id', classData.id);

        if (deleteError) {
          console.error('Schedule delete error:', deleteError);
          throw deleteError;
        }

        // Then create new schedule with proper time formatting
        const { error: scheduleError } = await supabase
          .from('class_schedules')
          .insert({
            class_id: classData.id,
            day_of_week: parseInt(scheduleData.day_of_week),
            start_time: `1970-01-01T${scheduleData.start_time}:00.000Z`,
            end_time: `1970-01-01T${scheduleData.end_time}:00.000Z`,
          });

        if (scheduleError) {
          console.error('Schedule insert error:', scheduleError);
          throw scheduleError;
        }

        console.log('Schedule updated successfully');
      } else if (classData.class_schedules && classData.class_schedules.length > 0) {
        // If schedule fields are empty but there were existing schedules, delete them
        console.log('Removing existing schedules as new schedule data is empty');
        const { error: deleteError } = await supabase
          .from('class_schedules')
          .delete()
          .eq('class_id', classData.id);

        if (deleteError) {
          console.error('Schedule delete error:', deleteError);
          throw deleteError;
        }
      }

      toast.success('Class updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AddClassFormFields 
            formData={formData} 
            onFormDataChange={setFormData} 
          />
          
          <TrainerSelector 
            selectedTrainerId={formData.trainer_id} 
            onTrainerChange={(trainerId) => setFormData(prev => ({ ...prev, trainer_id: trainerId }))} 
          />
          
          <ClassScheduleSection 
            scheduleData={scheduleData} 
            onScheduleChange={setScheduleData} 
          />

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-fitness-red hover:bg-red-700"
            >
              {isSubmitting ? 'Updating...' : 'Update Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
