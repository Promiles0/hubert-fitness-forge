
import { Phone, Mail } from 'lucide-react';

interface TrainerCardContactProps {
  phone?: string;
  email?: string;
}

const TrainerCardContact = ({ phone, email }: TrainerCardContactProps) => {
  if (!phone && !email) return null;

  return (
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
  );
};

export default TrainerCardContact;
