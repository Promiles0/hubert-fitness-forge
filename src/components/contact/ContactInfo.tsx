
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';

const ContactInfo = () => {
  return (
    <div>
      <SectionTitle 
        title="Get in Touch" 
        subtitle="Have questions or ready to start your fitness journey? Reach out to us using any of the methods below."
        center={false}
      />
      
      <div className="space-y-8 mt-8">
        <div className="flex items-start">
          <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
            <MapPin size={24} className="text-fitness-red" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Our Location</h3>
            <p className="text-gray-400">Juru Park</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
            <Mail size={24} className="text-fitness-red" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Email Us</h3>
            <a href="mailto:hubertsingiza@gmail.com" className="text-gray-400 hover:text-fitness-red transition-colors"> 
              <p>hubertsingiza@gmail.com</p>
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
            <Phone size={24} className="text-fitness-red" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Call Us</h3>
            <p className="text-gray-400">Main: +250 780 899 767</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
            <Clock size={24} className="text-fitness-red" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Working Hours</h3>
            <p className="text-gray-400">Monday - Thursday: 7:00 AM - 18:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
