
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

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
}

const TrainerCard = ({ 
  name, 
  role, 
  image, 
  bio, 
  socialMedia = {},
  className,
  style 
}: TrainerCardProps) => {
  return (
    <div 
      className={cn(
        "bg-fitness-darkGray rounded-lg overflow-hidden group",
        className
      )}
      style={style}
    >
      <div className="h-72 relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" 
        />
        {/* Social media overlay that appears on hover */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          {socialMedia.instagram && (
            <a 
              href={socialMedia.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-fitness-red transition-colors"
            >
              <Instagram size={24} />
            </a>
          )}
          {socialMedia.facebook && (
            <a 
              href={socialMedia.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-fitness-red transition-colors"
            >
              <Facebook size={24} />
            </a>
          )}
          {socialMedia.linkedin && (
            <a 
              href={socialMedia.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-fitness-red transition-colors"
            >
              <Linkedin size={24} />
            </a>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-fitness-red font-medium mb-3">{role}</p>
        <p className="text-gray-400">{bio}</p>
      </div>
    </div>
  );
};

export default TrainerCard;
