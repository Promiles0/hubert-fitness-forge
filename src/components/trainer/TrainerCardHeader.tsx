
import { Award, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainerCardHeaderProps {
  name: string;
  role: string;
  onMessageClick: () => void;
  onBookSessionClick: () => void;
}

const TrainerCardHeader = ({ name, role, onMessageClick, onBookSessionClick }: TrainerCardHeaderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white group-hover:text-fitness-red transition-colors leading-tight">
            {name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <Award className="text-fitness-red" size={16} />
            <p className="text-fitness-red font-semibold text-sm uppercase tracking-wider">
              {role}
            </p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/20 hover:bg-fitness-red hover:border-fitness-red transition-colors"
            onClick={onMessageClick}
          >
            <MessageCircle size={14} />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="text-white border-white/20 hover:bg-fitness-red hover:border-fitness-red transition-colors"
            onClick={onBookSessionClick}
          >
            <Calendar size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainerCardHeader;
