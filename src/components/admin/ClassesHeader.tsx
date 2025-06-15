
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassesHeaderProps {
  onAddClass: () => void;
}

const ClassesHeader = ({ onAddClass }: ClassesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white">Classes & Bookings</h2>
      
      <Button className="bg-fitness-red hover:bg-red-700 w-full sm:w-auto" onClick={onAddClass}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Class
      </Button>
    </div>
  );
};

export default ClassesHeader;
