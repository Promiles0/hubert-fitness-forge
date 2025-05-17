
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface FitnessClass {
  id: string;
  name: string;
  trainer: string;
  time: string;
  date: Date;
  duration: string;
  capacity: number;
  enrolled: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: FitnessClass | null;
  onConfirm: () => void;
}

const BookingConfirmation = ({ 
  isOpen, 
  onClose, 
  classItem, 
  onConfirm 
}: BookingConfirmationProps) => {
  if (!classItem) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-fitness-darkGray text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Booking</DialogTitle>
          <DialogDescription className="text-gray-300">
            You're about to book the following class:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-fitness-black p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">{classItem.name}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-fitness-red" />
                <span>Instructor: {classItem.trainer}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-fitness-red" />
                <span>Date: {format(classItem.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-fitness-red" />
                <span>Time: {classItem.time} ({classItem.duration})</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-300">
            By confirming, you agree to our cancellation policy. Please arrive 10 minutes before class starts.
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-fitness-black"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="bg-fitness-red hover:bg-red-700"
            onClick={onConfirm}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;
