
import { Clock } from 'lucide-react';

const TrainerCardAvailability = () => {
  return (
    <div className="flex items-center justify-between text-sm pt-3 border-t border-fitness-lightGray/20">
      <div className="flex items-center space-x-2">
        <Clock size={14} className="text-gray-400" />
        <span className="text-gray-400">Next Available</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-white font-medium">Today 2:00 PM</span>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default TrainerCardAvailability;
