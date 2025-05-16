
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  image?: string;
  className?: string;
  style?: CSSProperties;
}

const TestimonialCard = ({
  quote,
  name,
  role,
  image,
  className,
  style
}: TestimonialCardProps) => {
  return (
    <div 
      className={cn(
        "bg-fitness-darkGray rounded-lg p-6 md:p-8",
        className
      )}
      style={style}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <svg className="w-10 h-10 text-fitness-red mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.5 0 2.818-.611 3.95-1.5C13.157 21.085 11 24.05 8.5 25.5a1 1 0 1 0 1 1.73C13 24.69 16 20.42 16 14c0-3.314-2.686-6-6-6zm14 0c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.5 0 2.818-.611 3.95-1.5C27.157 21.085 25 24.05 22.5 25.5a1 1 0 1 0 1 1.73C27 24.69 30 20.42 30 14c0-3.314-2.686-6-6-6z"></path>
          </svg>
          <p className="text-gray-300 italic">{quote}</p>
        </div>
        <div className="mt-auto flex items-center">
          {image && (
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h4 className="font-bold">{name}</h4>
            {role && <p className="text-sm text-gray-400">{role}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
