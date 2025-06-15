
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X, Sparkles } from "lucide-react";

interface EmptyStateProps {
  type: 'upcoming' | 'past' | 'cancelled';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const getEmptyStateConfig = (type: string) => {
    switch (type) {
      case 'upcoming':
        return {
          icon: Calendar,
          title: "No upcoming classes",
          description: "Book a class to start your fitness journey",
          showButton: true,
          buttonText: "Browse Classes",
          buttonAction: () => window.location.href = '/schedule'
        };
      case 'past':
        return {
          icon: Clock,
          title: "No past classes",
          description: "Your completed classes will appear here",
          showButton: false
        };
      case 'cancelled':
        return {
          icon: X,
          title: "No cancelled classes",
          description: "Cancelled classes will appear here",
          showButton: false
        };
      default:
        return {
          icon: Calendar,
          title: "No classes",
          description: "Classes will appear here",
          showButton: false
        };
    }
  };

  const config = getEmptyStateConfig(type);
  const IconComponent = config.icon;

  return (
    <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl">
      <CardContent className="p-8 sm:p-12 text-center">
        <div className="relative mb-6">
          {type === 'upcoming' && (
            <div className="absolute inset-0 animate-ping">
              <IconComponent className="h-16 w-16 text-fitness-red/30 mx-auto" />
            </div>
          )}
          <IconComponent className={`h-16 w-16 mx-auto relative z-10 ${
            type === 'upcoming' 
              ? 'text-fitness-red' 
              : 'text-gray-400 dark:text-gray-600 animate-pulse'
          }`} />
        </div>
        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3">{config.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">{config.description}</p>
        {config.showButton && (
          <Button 
            className="bg-gradient-to-r from-fitness-red to-red-600 hover:from-red-600 hover:to-red-700 min-h-[48px] font-semibold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={config.buttonAction}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {config.buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
