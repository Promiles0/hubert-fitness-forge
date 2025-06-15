
import { Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainerCardActionsProps {
  onBookSessionClick: () => void;
  onMessageClick: () => void;
}

const TrainerCardActions = ({ onBookSessionClick, onMessageClick }: TrainerCardActionsProps) => {
  return (
    <div className="flex space-x-3 pt-4">
      <Button 
        className="flex-1 bg-fitness-red hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        onClick={onBookSessionClick}
      >
        <Calendar size={16} className="mr-2" />
        Book Session
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 border-fitness-lightGray/30 text-gray-300 hover:bg-fitness-lightGray/10 hover:text-white py-2.5 rounded-lg transition-colors"
        onClick={onMessageClick}
      >
        <MessageCircle size={16} className="mr-2" />
        Message
      </Button>
    </div>
  );
};

export default TrainerCardActions;
