
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassesHeaderProps {
  onAddClass: () => void;
}

const ClassesHeader = ({ onAddClass }: ClassesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Classes & Bookings</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:hidden">Manage your fitness classes</p>
      </div>
      
      <Button 
        className="bg-fitness-red hover:bg-red-700 w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4" 
        onClick={onAddClass}
      >
        <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sm:hidden">Add Class</span>
        <span className="hidden sm:inline">Add New Class</span>
      </Button>
    </div>
  );
};

export default ClassesHeader;
