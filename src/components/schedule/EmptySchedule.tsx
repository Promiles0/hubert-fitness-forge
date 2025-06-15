
import React from 'react';
import { Calendar } from "lucide-react";

interface EmptyScheduleProps {
  selectedDayName: string;
}

const EmptySchedule = ({ selectedDayName }: EmptyScheduleProps) => {
  return (
    <div className="col-span-full text-center py-20">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-3xl p-16 max-w-lg mx-auto border border-gray-700/50 backdrop-blur-xl">
        <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-gray-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-200 mb-4">
          No Classes Today
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          No classes are scheduled for {selectedDayName}. 
          <br />Check other days for available sessions.
        </p>
      </div>
    </div>
  );
};

export default EmptySchedule;
