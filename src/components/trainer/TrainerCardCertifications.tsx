
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrainerCardCertificationsProps {
  certifications: any[];
}

const TrainerCardCertifications = ({ certifications }: TrainerCardCertificationsProps) => {
  if (certifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-white text-sm font-semibold flex items-center space-x-2">
        <Award size={16} className="text-fitness-red" />
        <span>Certifications</span>
      </h4>
      <div className="flex flex-wrap gap-2">
        {certifications.slice(0, 4).map((cert: any, index: number) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="text-xs bg-gradient-to-r from-fitness-red/10 to-fitness-red/5 text-fitness-red border-fitness-red/30 hover:bg-fitness-red/20 hover:border-fitness-red transition-colors"
          >
            {typeof cert === 'string' ? cert : cert.name || 'Certified'}
          </Badge>
        ))}
        {certifications.length > 4 && (
          <Badge 
            variant="outline" 
            className="text-xs bg-fitness-lightGray/20 text-gray-300 border-gray-600"
          >
            +{certifications.length - 4} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TrainerCardCertifications;
