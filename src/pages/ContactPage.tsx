
import React from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';
import LocationMap from '@/components/contact/LocationMap';

const ContactPage = () => {
  return (
    <div className="pt-20"> {/* Adding padding for the fixed navbar */}
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Info & Form Section */}
      <section className="bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <ContactInfo />
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <LocationMap />
    </div>
  );
};

export default ContactPage;
