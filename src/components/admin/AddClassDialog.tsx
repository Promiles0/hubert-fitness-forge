
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { timeStringToTimestamp } from "@/utils/timeUtils";
import AddClassFormFields from "./AddClassFormFields";
import TrainerSelector from "./TrainerSelector";
import ClassScheduleSection from "./ClassScheduleSection";

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClassDialog = ({ open, onOpenChange }: AddClassDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    class_type: "",
    capacity: "",
    duration_minutes: "",
    room: "",
    trainer_id: "",
    day_of_week: "",
    start_time: "",
    end_time: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that a trainer is selected
      if (!formData.trainer_id) {
        toast.error("Please select a trainer for the class");
        return;
      }

      // Insert class
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          name: formData.name,
          description: formData.description,
          class_type: formData.class_type as any,
          capacity: parseInt(formData.capacity),
          duration_minutes: parseInt(formData.duration_minutes),
          room: formData.room,
          trainer_id: formData.trainer_id
        })
        .select()
        .single();

      if (classError) throw classError;

      // Insert schedule if provided
      if (formData.day_of_week && formData.start_time && formData.end_time) {
        const dayOfWeek = parseInt(formData.day_of_week);
        const startTimestamp = timeStringToTimestamp(formData.start_time, dayOfWeek);
        const endTimestamp = timeStringToTimestamp(formData.end_time, dayOfWeek);

        const { error: scheduleError } = await supabase
          .from('class_schedules')
          .insert({
            class_id: classData.id,
            day_of_week: dayOfWeek,
            start_time: startTimestamp,
            end_time: endTimestamp
          });

        if (scheduleError) throw scheduleError;
      }

      toast.success('Class added successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comprehensive-stats'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        class_type: "",
        capacity: "",
        duration_minutes: "",
        room: "",
        trainer_id: "",
        day_of_week: "",
        start_time: "",
        end_time: ""
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new fitness class. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddClassFormFields 
            formData={formData}
            onFormDataChange={setFormData}
          />

          <TrainerSelector
            selectedTrainerId={formData.trainer_id}
            onTrainerChange={(trainerId) => setFormData({ ...formData, trainer_id: trainerId })}
          />

          <ClassScheduleSection
            scheduleData={{
              day_of_week: formData.day_of_week,
              start_time: formData.start_time,
              end_time: formData.end_time
            }}
            onScheduleChange={(scheduleData) => setFormData({ ...formData, ...scheduleData })}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
