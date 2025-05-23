
import React from 'react';

const LocationMap = () => {
  return (
    <section className="bg-fitness-black py-8 md:py-12">
      <div className="container-custom">
        <div className="rounded-lg overflow-hidden h-96">
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
  );
};

export default LocationMap;
