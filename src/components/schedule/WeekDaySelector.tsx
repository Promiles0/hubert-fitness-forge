
import React from 'react';
import { Button } from "@/components/ui/button";

interface WeekDaySelectorProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const WeekDaySelector = ({ selectedDay, onDaySelect }: WeekDaySelectorProps) => {
  const weekDays = [
    { name: "Sunday", value: 0 },
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 },
    { name: "Saturday", value: 6 }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {weekDays.map((day) => (
        <Button
          key={day.value}
          variant={selectedDay === day.value ? "default" : "outline"}
          className={`relative px-8 py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-500 transform hover:scale-105 ${
            selectedDay === day.value 
              ? "bg-gradient-to-r from-fitness-red to-red-600 text-white shadow-2xl shadow-red-500/30 border-0" 
              : "border-2 border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 hover:border-fitness-red/50 hover:text-white backdrop-blur-sm"
          }`}
          onClick={() => onDaySelect(day.value)}
        >
          <span className="relative z-10">{day.name}</span>
          {selectedDay === day.value && (
            <div className="absolute inset-0 bg-gradient-to-r from-fitness-red/20 to-red-600/20 rounded-md blur-xl"></div>
          )}
        </Button>
      ))}
    </div>
  );
};

export default WeekDaySelector;
