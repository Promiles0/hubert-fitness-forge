
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatTimeForDisplay } from "@/utils/timeUtils";
import ScheduleHero from "@/components/schedule/ScheduleHero";
import WeekDaySelector from "@/components/schedule/WeekDaySelector";
import ClassCard from "@/components/schedule/ClassCard";
import EmptySchedule from "@/components/schedule/EmptySchedule";

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [bookingStates, setBookingStates] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: classes, isLoading } = useQuery({
    queryKey: ['schedule', selectedDay],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_schedules')
        .select(`
          *,
          classes!inner(
            name,
            description,
            class_type,
            capacity,
            duration_minutes,
            room,
            trainers(first_name, last_name, photo_url)
          )
        `)
        .eq('day_of_week', selectedDay)
        .order('start_time');

      if (error) throw error;
      return data;
    },
  });

  const weekDays = [
    { name: "Sunday", value: 0 },
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 },
    { name: "Saturday", value: 6 }
  ];

  const handleReserveSpot = (schedule: any) => {
    // Check if user is authenticated before allowing reservation
    if (!isAuthenticated) {
      toast.error("Please log in to reserve your spot!");
      navigate('/login');
      return;
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setBookingStates(prev => ({ ...prev, [schedule.id]: true }));

    try {
      // Get current date for the selected day
      const today = new Date();
      const currentDay = today.getDay();
      const daysUntilSelected = (selectedDay - currentDay + 7) % 7;
      const classDate = new Date(today);
      classDate.setDate(today.getDate() + daysUntilSelected);
      
      // Handle trainer data safely - check if trainers exists and is not null
      const trainerName = schedule.classes.trainers && schedule.classes.trainers.first_name && schedule.classes.trainers.last_name
        ? `${schedule.classes.trainers.first_name} ${schedule.classes.trainers.last_name}`
        : 'Staff Trainer';
      
      const booking = {
        id: bookingId,
        classId: schedule.class_id,
        className: schedule.classes.name,
        trainer: trainerName,
        time: formatTimeForDisplay(schedule.start_time),
        date: classDate.toISOString().split('T')[0],
        dateFormatted: classDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        duration: `${schedule.classes.duration_minutes} min`,
        level: 'Intermediate', // Default level since it's not in the schedule data
        category: schedule.classes.class_type,
        room: schedule.classes.room,
        status: 'confirmed' as const,
        bookedAt: new Date().toISOString()
      };

      // Get existing bookings from localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      
      // Check if already booked
      const alreadyBooked = existingBookings.some((b: any) => 
        b.className === booking.className && 
        b.date === booking.date && 
        b.time === booking.time
      );

      if (alreadyBooked) {
        toast.error("You have already booked this class!");
        setBookingStates(prev => ({ ...prev, [schedule.id]: false }));
        return;
      }

      // Add new booking
      const updatedBookings = [...existingBookings, booking];
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      
      toast.success(`Successfully reserved your spot in ${schedule.classes.name}!`);
      
      // Reset booking state after a short delay
      setTimeout(() => {
        setBookingStates(prev => ({ ...prev, [schedule.id]: false }));
      }, 2000);
      
    } catch (error) {
      console.error('Error booking class:', error);
      toast.error("Failed to reserve your spot. Please try again.");
      setBookingStates(prev => ({ ...prev, [schedule.id]: false }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  const selectedDayName = weekDays.find(d => d.value === selectedDay)?.name || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-black via-gray-950 to-fitness-darkGray text-white">
      <div className="container mx-auto px-4 py-16">
        <ScheduleHero />
        <WeekDaySelector selectedDay={selectedDay} onDaySelect={setSelectedDay} />
        
        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes && classes.length > 0 ? (
            classes.map((schedule) => (
              <ClassCard
                key={schedule.id}
                schedule={schedule}
                isBooking={bookingStates[schedule.id] || false}
                onReserveSpot={handleReserveSpot}
              />
            ))
          ) : (
            <EmptySchedule selectedDayName={selectedDayName} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
