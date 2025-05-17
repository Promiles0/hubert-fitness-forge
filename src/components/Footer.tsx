
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-fitness-black text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-fitness-red">HUBERT</span> FITNESS
            </h3>
            <p className="text-gray-400 mb-4">
              Unlock your potential. Transform your body. Elevate your life.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fitness-red transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fitness-red transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fitness-red transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fitness-red transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-fitness-red transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-fitness-red transition-colors">Our Programs</Link></li>
              <li><Link to="/membership" className="text-gray-400 hover:text-fitness-red transition-colors">Membership Plans</Link></li>
              <li><Link to="/trainers" className="text-gray-400 hover:text-fitness-red transition-colors">Our Trainers</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-fitness-red transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Working Hours</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Monday - Friday: 5:00 AM - 10:00 PM</li>
              <li>Saturday: 6:00 AM - 8:00 PM</li>
              <li>Sunday: 6:00 AM - 6:00 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-fitness-red shrink-0 mt-1" />
                <span className="text-gray-400">123 Fitness Avenue, Gym City, GC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-fitness-red" />
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-fitness-red" />
                <span className="text-gray-400">info@hubertfitness.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 HUBERT FITNESS. All rights reserved.
            </p>
            <div className="flex space-x-4 text-gray-500 text-sm">
              <Link to="/terms" className="hover:text-fitness-red transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-fitness-red transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
