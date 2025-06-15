
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
        
        // Extract time from timestamp - handle both timestamp and time string formats
        const extractTime = (timeValue: string) => {
          if (!timeValue) return '';
          
          try {
            // If it's already in HH:MM format, return as is
            if (timeValue.match(/^\d{2}:\d{2}$/)) {
              return timeValue;
            }
            
            // If it's a timestamp, extract time
            const date = new Date(timeValue);
            if (!isNaN(date.getTime())) {
              return date.toTimeString().substring(0, 5);
            }
            
            return '';
          } catch (error) {
            console.error('Error extracting time:', error);
            return '';
          }
        };
        
        setScheduleData({
          day_of_week: schedule.day_of_week?.toString() || '',
          start_time: extractTime(schedule.start_time),
          end_time: extractTime(schedule.end_time),
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

      // Update the class first
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

      console.log('Class updated successfully, now handling schedule...');

      // Handle schedule updates
      if (scheduleData.day_of_week && scheduleData.start_time && scheduleData.end_time) {
        console.log('Updating schedule with data:', scheduleData);
        
        // Create time strings for today's date to ensure proper timestamp format
        const createTimestamp = (timeString: string) => {
          const today = new Date();
          const [hours, minutes] = timeString.split(':');
          today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          return today.toISOString();
        };

        const newScheduleData = {
          class_id: classData.id,
          day_of_week: parseInt(scheduleData.day_of_week),
          start_time: createTimestamp(scheduleData.start_time),
          end_time: createTimestamp(scheduleData.end_time),
        };

        console.log('Formatted schedule data:', newScheduleData);

        // Delete existing schedules for this class first
        const { error: deleteError } = await supabase
          .from('class_schedules')
          .delete()
          .eq('class_id', classData.id);

        if (deleteError) {
          console.error('Schedule delete error:', deleteError);
          throw deleteError;
        }

        console.log('Existing schedules deleted, inserting new schedule...');

        // Insert new schedule
        const { error: scheduleError } = await supabase
          .from('class_schedules')
          .insert(newScheduleData);

        if (scheduleError) {
          console.error('Schedule insert error:', scheduleError);
          throw scheduleError;
        }

        console.log('Schedule updated successfully');
      } else if (classData.class_schedules && classData.class_schedules.length > 0 && 
                 (!scheduleData.day_of_week || !scheduleData.start_time || !scheduleData.end_time)) {
        // If schedule fields are empty but there were existing schedules, delete them
        console.log('Removing existing schedules as new schedule data is incomplete');
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
      queryClient.invalidateQueries({ queryKey: ['class-schedules'] });
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
