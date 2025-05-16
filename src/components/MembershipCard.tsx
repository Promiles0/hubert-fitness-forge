
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MembershipCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  className?: string;
}

const MembershipCard = ({ 
  title, 
  price, 
  period, 
  features, 
  popular = false,
  className 
}: MembershipCardProps) => {
  return (
    <div className={cn(
      "relative bg-fitness-darkGray rounded-lg p-8 transition-all duration-300 hover:translate-y-[-5px]",
      popular && "border-2 border-fitness-red shadow-lg shadow-fitness-red/10",
      className
    )}>
      {popular && (
        <div className="absolute top-0 right-0 bg-fitness-red text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-400">/{period}</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={18} className="text-fitness-red mr-2 mt-1 shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button className={cn(
        "w-full",
        popular ? "bg-fitness-red hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
      )}>
        Choose Plan
      </Button>
    </div>
  );
};

export default MembershipCard;
