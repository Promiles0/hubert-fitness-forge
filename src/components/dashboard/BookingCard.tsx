
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, X, AlertCircle, Sparkles, Zap, Heart, Target } from "lucide-react";

interface Booking {
  id: string;
  classId: string;
  className: string;
  trainer: string;
  time: string;
  date: string;
  dateFormatted: string;
  duration: string;
  level: string;
  category: string;
  room?: string;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}

interface BookingCardProps {
  booking: Booking;
  showCancel?: boolean;
  onCancel?: (booking: Booking) => void;
}

const BookingCard = ({ booking, showCancel = false, onCancel }: BookingCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500/20 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/20 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'yoga': return Heart;
      case 'hiit': case 'cardio': return Zap;
      case 'strength': return Target;
      default: return Sparkles;
    }
  };

  const IconComponent = getCategoryIcon(booking.category);
  
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:border-fitness-red/30 dark:hover:border-fitness-red/40 transition-all duration-700 hover:shadow-2xl hover:shadow-fitness-red/10 dark:hover:shadow-fitness-red/20 hover:-translate-y-2 hover:scale-[1.02]">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-fitness-red/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
        <IconComponent className="h-12 w-12 text-fitness-red" />
      </div>
      
      <CardContent className="relative z-10 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-fitness-red/10 dark:bg-fitness-red/20 group-hover:bg-fitness-red/20 dark:group-hover:bg-fitness-red/30 transition-colors duration-500">
                <IconComponent className="h-5 w-5 text-fitness-red" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-fitness-red transition-colors duration-300">
                  {booking.className}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">with <span className="font-medium">{booking.trainer}</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getLevelColor(booking.level)} text-xs font-semibold px-3 py-1.5 border transition-all duration-300 group-hover:scale-105`}>
              {booking.level}
            </Badge>
            {booking.status === 'cancelled' && (
              <Badge variant="destructive" className="text-xs font-semibold px-3 py-1.5 animate-pulse">
                <AlertCircle className="h-3 w-3 mr-1" />
                Cancelled
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-fitness-red/10 to-red-500/20 dark:from-fitness-red/20 dark:to-red-500/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-4 w-4 text-fitness-red" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white block">{booking.dateFormatted}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Session Date</span>
              </div>
            </div>
            <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/20 dark:from-blue-500/20 dark:to-blue-600/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white block">{booking.time}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{booking.duration} session</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {booking.room && (
              <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-600/20 dark:from-purple-500/20 dark:to-purple-600/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">{booking.room}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Studio Location</span>
                </div>
              </div>
            )}
            <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 dark:from-emerald-500/20 dark:to-emerald-600/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <User className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white block">{booking.category}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Class Type</span>
              </div>
            </div>
          </div>
        </div>
        
        {showCancel && booking.status === 'confirmed' && onCancel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 min-h-[48px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group-hover:animate-pulse"
            onClick={() => onCancel(booking)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Class
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
