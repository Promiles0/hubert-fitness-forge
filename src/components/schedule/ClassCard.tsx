
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  MapPin, 
  User,
  Edit,
  Trash2
} from "lucide-react";
import { formatTimeForDisplay } from "@/utils/timeUtils";

interface ClassCardProps {
  schedule: any;
  isBooking: boolean;
  onReserveSpot: (schedule: any) => void;
  onEdit?: (schedule: any) => void;
  onDelete?: (schedule: any) => void;
  showEditDelete?: boolean;
}

const ClassCard = ({ 
  schedule, 
  isBooking, 
  onReserveSpot, 
  onEdit, 
  onDelete, 
  showEditDelete = false 
}: ClassCardProps) => {
  const getClassTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'yoga': return 'bg-purple-100 text-purple-800';
      case 'hiit': return 'bg-red-100 text-red-800';
      case 'cardio': return 'bg-blue-100 text-blue-800';
      case 'strength': return 'bg-green-100 text-green-800';
      case 'pilates': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit button clicked for schedule:', schedule);
    if (onEdit) {
      onEdit(schedule);
    } else {
      console.warn('No onEdit handler provided');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete button clicked for schedule:', schedule);
    if (onDelete) {
      onDelete(schedule);
    } else {
      console.warn('No onDelete handler provided');
    }
  };

  const handleReserveSpot = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReserveSpot(schedule);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">
              {schedule.classes.name}
            </h3>
            <Badge className={getClassTypeColor(schedule.classes.class_type)}>
              {schedule.classes.class_type}
            </Badge>
          </div>
          
          {showEditDelete && (
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-white hover:bg-white/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTimeForDisplay(schedule.start_time)} - {formatTimeForDisplay(schedule.end_time)}</span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <Users className="h-4 w-4 mr-2" />
            <span>Capacity: {schedule.classes.capacity}</span>
          </div>
          
          {schedule.classes.room && (
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Room: {schedule.classes.room}</span>
            </div>
          )}
          
          {schedule.classes.trainers && (
            <div className="flex items-center text-gray-300">
              <User className="h-4 w-4 mr-2" />
              <span>
                {schedule.classes.trainers.first_name} {schedule.classes.trainers.last_name}
              </span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-400 mb-4">
          {schedule.classes.description}
        </div>

        <Button
          onClick={handleReserveSpot}
          disabled={isBooking}
          className="w-full bg-fitness-red hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {isBooking ? 'Booking...' : 'Reserve Your Spot'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
