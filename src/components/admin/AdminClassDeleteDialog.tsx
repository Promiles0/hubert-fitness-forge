
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface AdminClassDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: ClassSchedule | null;
  onConfirmDelete: () => void;
}

const AdminClassDeleteDialog = ({
  open,
  onOpenChange,
  selectedClass,
  onConfirmDelete
}: AdminClassDeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-black border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Class</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete {selectedClass?.class.name}? This will also delete all bookings for this class.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminClassDeleteDialog;
