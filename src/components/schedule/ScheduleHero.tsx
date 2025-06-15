
import React from 'react';

const ScheduleHero = () => {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-fitness-red/5 via-transparent to-fitness-red/5 blur-3xl -z-10"></div>
      <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
        Class Schedule
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
        Discover your perfect workout with our premium fitness classes
      </p>
      <div className="w-24 h-1 bg-gradient-to-r from-fitness-red to-red-400 mx-auto mt-8 rounded-full"></div>
    </div>
  );
};

export default ScheduleHero;
