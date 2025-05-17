
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

const LoadingSpinner = ({ 
  size = 24, 
  className = "",
  color = "text-fitness-red"
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${color}`} size={size} />
    </div>
  );
};

export default LoadingSpinner;
