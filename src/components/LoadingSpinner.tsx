
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
  variant?: 'default' | 'fitness';
}

const LoadingSpinner = ({ 
  size = 24, 
  className = "",
  color = "text-fitness-red",
  variant = 'default'
}: LoadingSpinnerProps) => {
  if (variant === 'fitness') {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-fitness-red/20 border-t-fitness-red"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-fitness-red/40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${color}`} size={size} />
    </div>
  );
};

export default LoadingSpinner;
