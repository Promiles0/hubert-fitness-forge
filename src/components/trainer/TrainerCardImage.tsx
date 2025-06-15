import { Star, Instagram, Facebook, Linkedin } from 'lucide-react';

interface TrainerCardImageProps {
  image: string;
  name: string;
  experienceYears: number;
  rating: number;
  totalReviews: number;
  hourlyRate?: number;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

const TrainerCardImage = ({ 
  image, 
  name, 
  experienceYears, 
  rating, 
  totalReviews, 
  hourlyRate,
  socialMedia = {}
}: TrainerCardImageProps) => {
  return (
    <div className="h-80 relative overflow-hidden">
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
      
      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {experienceYears > 0 && (
          <div className="bg-fitness-red/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
            <Star size={14} />
            <span>{experienceYears}+ years</span>
          </div>
        )}
        
        {/* Availability Status */}
        <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
          <span>Available</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"} 
              />
            ))}
          </div>
          <span className="text-white text-sm font-medium">{rating}</span>
          <span className="text-gray-300 text-xs">({totalReviews} reviews)</span>
        </div>

        {/* Social Media & Contact */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
          <div className="flex space-x-3">
            {socialMedia.instagram && (
              <a 
                href={socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-fitness-red transition-colors transform hover:scale-110 bg-white/10 backdrop-blur-sm p-2 rounded-full"
              >
                <Instagram size={18} />
              </a>
            )}
            {socialMedia.facebook && (
              <a 
                href={socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-fitness-red transition-colors transform hover:scale-110 bg-white/10 backdrop-blur-sm p-2 rounded-full"
              >
                <Facebook size={18} />
              </a>
            )}
            {socialMedia.linkedin && (
              <a 
                href={socialMedia.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-fitness-red transition-colors transform hover:scale-110 bg-white/10 backdrop-blur-sm p-2 rounded-full"
              >
                <Linkedin size={18} />
              </a>
            )}
          </div>
          
          {hourlyRate && (
            <div className="bg-fitness-red/90 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg">
              ${hourlyRate}/hr
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerCardImage;
