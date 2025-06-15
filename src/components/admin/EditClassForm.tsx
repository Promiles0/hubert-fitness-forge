
import { Button } from "@/components/ui/button";
import AddClassFormFields from "./AddClassFormFields";
import TrainerSelector from "./TrainerSelector";
import ClassScheduleSection from "./ClassScheduleSection";

interface EditClassFormProps {
  formData: {
    name: string;
    description: string;
    class_type: string;
    capacity: string;
    duration_minutes: string;
    room: string;
    trainer_id: string;
  };
  scheduleData: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  };
  isSubmitting: boolean;
  onFormDataChange: (data: any) => void;
  onScheduleChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EditClassForm = ({
  formData,
  scheduleData,
  isSubmitting,
  onFormDataChange,
  onScheduleChange,
  onSubmit,
  onCancel,
}: EditClassFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AddClassFormFields 
        formData={formData} 
        onFormDataChange={onFormDataChange} 
      />
      
      <TrainerSelector 
        selectedTrainerId={formData.trainer_id} 
        onTrainerChange={(trainerId) => onFormDataChange(prev => ({ ...prev, trainer_id: trainerId }))} 
      />
      
      <ClassScheduleSection 
        scheduleData={scheduleData} 
        onScheduleChange={onScheduleChange} 
      />

      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
  );
};

export default EditClassForm;
