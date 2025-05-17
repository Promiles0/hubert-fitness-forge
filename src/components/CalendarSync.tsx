
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Link } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';

const CalendarSync = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleCalendarSync = (type: string) => {
    // In a real app, this would generate an actual calendar file or link
    toast.success(`Calendar synced to ${type}`);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-fitness-darkGray border-gray-700 text-white hover:bg-fitness-red hover:text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Sync to Calendar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] bg-fitness-darkGray border-gray-700 text-white p-4">
        <div className="space-y-2">
          <h3 className="font-medium mb-2">Add to calendar</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-gray-700 hover:bg-fitness-black hover:text-white"
            onClick={() => handleCalendarSync('Google Calendar')}
          >
            <span className="mr-2">📅</span> Google Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-gray-700 hover:bg-fitness-black hover:text-white"
            onClick={() => handleCalendarSync('Apple Calendar')}
          >
            <span className="mr-2">📅</span> Apple Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-gray-700 hover:bg-fitness-black hover:text-white"
            onClick={() => handleCalendarSync('Outlook')}
          >
            <span className="mr-2">📅</span> Outlook
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-gray-700 hover:bg-fitness-black hover:text-white"
            onClick={() => handleCalendarSync('.ics file')}
          >
            <span className="mr-2">💾</span> Download .ics
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarSync;
