
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTrainerForm } from "@/hooks/useTrainerForm";
import TrainerFormFields from "./TrainerFormFields";
import TrainerSpecialtySelector from "./TrainerSpecialtySelector";

interface AddTrainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTrainerDialog = ({ open, onOpenChange }: AddTrainerDialogProps) => {
  const {
    formData,
    updateFormData,
    handleSpecialtyChange,
    submitForm,
    resetForm,
    isSubmitting
  } = useTrainerForm(() => {
    console.log('Trainer successfully added, closing dialog');
    onOpenChange(false);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    await submitForm();
  };

  const handleCancel = () => {
    console.log('Dialog cancelled, resetting form');
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trainer</DialogTitle>
          <DialogDescription>
            Add a new trainer to your fitness team. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TrainerFormFields
            formData={formData}
            onUpdate={updateFormData}
          />

          <TrainerSpecialtySelector
            selectedSpecialties={formData.specialties}
            onSpecialtyChange={handleSpecialtyChange}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Trainer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrainerDialog;
