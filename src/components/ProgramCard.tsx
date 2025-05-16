
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface ProgramCardProps {
  title: string;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  className?: string;
  style?: CSSProperties;
}

const ProgramCard = ({ title, description, image, level, className, style }: ProgramCardProps) => {
  return (
    <div 
      className={cn(
        "bg-fitness-darkGray rounded-lg overflow-hidden group hover:translate-y-[-5px] transition-all duration-300", 
        className
      )}
      style={style}
    >
      <div className="h-60 relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-fitness-red text-white px-3 py-1 rounded text-sm font-medium">
          {level}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 mb-5">{description}</p>
        <Button className="w-full bg-fitness-red hover:bg-red-700">Learn More</Button>
      </div>
    </div>
  );
};

export default ProgramCard;
