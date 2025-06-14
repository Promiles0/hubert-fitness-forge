
import { Facebook, Instagram, Linkedin, Award, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';
import { Badge } from '@/components/ui/badge';

interface TrainerCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  className?: string;
  style?: CSSProperties;
  trainer?: {
    experience_years?: number;
    certifications?: any;
    hourly_rate?: number;
    availability?: any;
  };
}

const TrainerCard = ({ 
  name, 
  role, 
  image, 
  bio, 
  socialMedia = {},
  className,
  style,
  trainer
}: TrainerCardProps) => {
  const certifications = trainer?.certifications ? Object.values(trainer.certifications) : [];
  const experienceYears = trainer?.experience_years || 0;
  const hourlyRate = trainer?.hourly_rate;

  return (
    <div 
      className={cn(
        "bg-fitness-darkGray rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2",
        className
      )}
      style={style}
    >
      {/* Image Section */}
      <div className="h-80 relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Overlay with social media */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex space-x-3">
              {socialMedia.instagram && (
                <a 
                  href={socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-fitness-red transition-colors transform hover:scale-110"
                >
                  <Instagram size={24} />
                </a>
              )}
              {socialMedia.facebook && (
                <a 
                  href={socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-fitness-red transition-colors transform hover:scale-110"
                >
                  <Facebook size={24} />
                </a>
              )}
              {socialMedia.linkedin && (
                <a 
                  href={socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-fitness-red transition-colors transform hover:scale-110"
                >
                  <Linkedin size={24} />
                </a>
              )}
            </div>
            
            {hourlyRate && (
              <div className="bg-fitness-red/90 px-3 py-1 rounded-full text-white text-sm font-semibold">
                ${hourlyRate}/hr
              </div>
            )}
          </div>
        </div>

        {/* Experience Badge */}
        {experienceYears > 0 && (
          <div className="absolute top-4 right-4 bg-fitness-red text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star size={14} />
            <span>{experienceYears}+ years</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-fitness-red transition-colors">
            {name}
          </h3>
          <div className="flex items-center space-x-2">
            <Award className="text-fitness-red" size={16} />
            <p className="text-fitness-red font-medium text-sm uppercase tracking-wide">
              {role}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {bio}
        </p>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white text-sm font-semibold flex items-center space-x-1">
              <Award size={14} />
              <span>Certifications</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {certifications.slice(0, 3).map((cert: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-fitness-lightGray/20 text-gray-300 border-gray-600 hover:bg-fitness-red/20 hover:border-fitness-red transition-colors"
                >
                  {typeof cert === 'string' ? cert : cert.name || 'Certified'}
                </Badge>
              ))}
              {certifications.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-fitness-lightGray/20 text-gray-300 border-gray-600"
                >
                  +{certifications.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Availability Indicator */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
