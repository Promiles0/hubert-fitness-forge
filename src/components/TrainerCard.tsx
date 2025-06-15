
import { Facebook, Instagram, Linkedin, Award, Clock, Star, MessageCircle, Calendar, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
    phone?: string;
    email?: string;
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
  const navigate = useNavigate();
  const certifications = trainer?.certifications ? Object.values(trainer.certifications) : [];
  const experienceYears = trainer?.experience_years || 0;
  const hourlyRate = trainer?.hourly_rate;
  const phone = trainer?.phone;
  const email = trainer?.email;

  // Generate a mock rating for demo purposes
  const rating = 4.8;
  const totalReviews = Math.floor(Math.random() * 150) + 20;

  const handleMessageClick = () => {
    navigate('/dashboard/chat');
  };

  const handleBookSessionClick = () => {
    navigate('/schedule');
  };

  return (
    <div 
      className={cn(
        "bg-gradient-to-br from-fitness-darkGray to-fitness-lightGray/50 rounded-2xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-fitness-lightGray/20",
        className
      )}
      style={style}
    >
      {/* Image Section with Enhanced Overlay */}
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

      {/* Content Section */}
      <div className="p-6 space-y-5">
        {/* Header with Name and Role */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white group-hover:text-fitness-red transition-colors leading-tight">
                {name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Award className="text-fitness-red" size={16} />
                <p className="text-fitness-red font-semibold text-sm uppercase tracking-wider">
                  {role}
                </p>
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-white border-white/20 hover:bg-fitness-red hover:border-fitness-red transition-colors"
                onClick={handleMessageClick}
              >
                <MessageCircle size={14} />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-white border-white/20 hover:bg-fitness-red hover:border-fitness-red transition-colors"
                onClick={handleBookSessionClick}
              >
                <Calendar size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {bio}
        </p>

        {/* Contact Information */}
        {(phone || email) && (
          <div className="space-y-3 py-4 border-t border-b border-fitness-lightGray/20">
            <h4 className="text-white text-sm font-semibold flex items-center space-x-2">
              <Phone size={16} className="text-fitness-red" />
              <span>Contact Information</span>
            </h4>
            <div className="space-y-2">
              {phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={14} className="text-gray-400" />
                  <a 
                    href={`tel:${phone}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-3">
                  <Mail size={14} className="text-gray-400" />
                  <a 
                    href={`mailto:${email}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-fitness-lightGray/20">
          <div className="text-center">
            <div className="text-fitness-red font-bold text-lg">{experienceYears}+</div>
            <div className="text-gray-400 text-xs uppercase tracking-wide">Years Exp</div>
          </div>
          <div className="text-center">
            <div className="text-fitness-red font-bold text-lg">{totalReviews}</div>
            <div className="text-gray-400 text-xs uppercase tracking-wide">Reviews</div>
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
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
        )}

        {/* Contact Actions */}
        <div className="flex space-x-3 pt-4">
          <Button 
            className="flex-1 bg-fitness-red hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            onClick={handleBookSessionClick}
          >
            <Calendar size={16} className="mr-2" />
            Book Session
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-fitness-lightGray/30 text-gray-300 hover:bg-fitness-lightGray/10 hover:text-white py-2.5 rounded-lg transition-colors"
            onClick={handleMessageClick}
          >
            <MessageCircle size={16} className="mr-2" />
            Message
          </Button>
        </div>

        {/* Availability Indicator */}
        <div className="flex items-center justify-between text-sm pt-3 border-t border-fitness-lightGray/20">
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-gray-400">Next Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">Today 2:00 PM</span>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
