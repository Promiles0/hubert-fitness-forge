
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerCardImage from './trainer/TrainerCardImage';
import TrainerCardHeader from './trainer/TrainerCardHeader';
import TrainerCardStats from './trainer/TrainerCardStats';
import TrainerCardCertifications from './trainer/TrainerCardCertifications';
import TrainerCardContact from './trainer/TrainerCardContact';
import TrainerCardActions from './trainer/TrainerCardActions';
import TrainerCardAvailability from './trainer/TrainerCardAvailability';

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
      <TrainerCardImage
        image={image}
        name={name}
        experienceYears={experienceYears}
        rating={rating}
        totalReviews={totalReviews}
        hourlyRate={hourlyRate}
        socialMedia={socialMedia}
      />

      {/* Content Section */}
      <div className="p-6 space-y-5">
        <TrainerCardHeader
          name={name}
          role={role}
          onMessageClick={handleMessageClick}
          onBookSessionClick={handleBookSessionClick}
        />

        {/* Bio */}
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {bio}
        </p>

        <TrainerCardContact phone={phone} email={email} />

        <TrainerCardStats experienceYears={experienceYears} totalReviews={totalReviews} />

        <TrainerCardCertifications certifications={certifications} />

        <TrainerCardActions 
          onBookSessionClick={handleBookSessionClick}
          onMessageClick={handleMessageClick}
        />

        <TrainerCardAvailability />
      </div>
    </div>
  );
};

export default TrainerCard;
