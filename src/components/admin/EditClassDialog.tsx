
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditClassForm } from "@/hooks/useEditClassForm";
import EditClassForm from "./EditClassForm";

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: any;
}

const EditClassDialog = ({ open, onOpenChange, classData }: EditClassDialogProps) => {
  const {
    formData,
    setFormData,
    scheduleData,
    setScheduleData,
    isSubmitting,
    handleSubmit,
  } = useEditClassForm(classData, open);

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, () => onOpenChange(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>

        <EditClassForm
          formData={formData}
          scheduleData={scheduleData}
          isSubmitting={isSubmitting}
          onFormDataChange={setFormData}
          onScheduleChange={setScheduleData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
