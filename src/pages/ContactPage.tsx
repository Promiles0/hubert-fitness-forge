
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <div className="pt-20"> {/* Adding padding for the fixed navbar */}
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              CONTACT <span className="text-fitness-red">US</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Get in touch with our team. We're here to help you on your fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
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
                    {/* <p className="text-gray-400">Gym City, GC 12345</p> */}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <Mail size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Email Us</h3>
                    <p className="text-gray-400">info@hubertfitness.com</p>
                    {/* <p className="text-gray-400">support@hubertfitness.com</p> */}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <Phone size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Call Us</h3>
                    <p className="text-gray-400">Main: +250 780 899 767</p>
                    {/* <p className="text-gray-400">Support: (555) 987-6543</p> */}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-fitness-red/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <Clock size={24} className="text-fitness-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Working Hours</h3>
                    <p className="text-gray-400">Monday - Thursday: 7:00 AM - 18:00 PM</p>
                    {/* <p className="text-gray-400">Saturday: 6:00 AM - 8:00 PM</p> */}
                    {/* <p className="text-gray-400">Sunday: 6:00 AM - 6:00 PM</p> */}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-fitness-darkGray p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-red"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-red"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-red"
                      placeholder="+(250) 78- --- ---"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      rows={5} 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-red"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full bg-fitness-red hover:bg-red-700">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-fitness-black py-8 md:py-12">
        <div className="container-custom">
          <div className="rounded-lg overflow-hidden h-96">
            {/* This is a placeholder for a Google Maps embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1621529114578!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="HUBERT FITNESS Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
