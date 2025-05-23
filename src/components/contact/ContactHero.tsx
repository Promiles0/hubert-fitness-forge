
import React from 'react';

const ContactHero = () => {
  return (
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
  );
};

export default ContactHero;
