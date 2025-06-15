
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Users, Calendar, Clock } from "lucide-react";

interface ClassBookingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: any;
}

const ClassBookingsDialog = ({ open, onOpenChange, classData }: ClassBookingsDialogProps) => {
  // Fetch bookings for all schedules of this class
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['class-bookings', classData?.id],
    queryFn: async () => {
      if (!classData?.id) return [];

      // First get all schedules for this class
      const { data: schedules, error: schedulesError } = await supabase
        .from('class_schedules')
        .select('id, day_of_week, start_time, end_time')
        .eq('class_id', classData.id);

      if (schedulesError) throw schedulesError;

      if (!schedules || schedules.length === 0) return [];

      // Get schedule IDs
      const scheduleIds = schedules.map(s => s.id);

      // Get bookings for these schedules
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          class_schedule_id,
          status,
          created_at,
          member_id
        `)
        .in('class_schedule_id', scheduleIds)
        .eq('status', 'confirmed');

      if (bookingsError) throw bookingsError;

      // Get member details for the bookings
      if (!bookingsData || bookingsData.length === 0) return [];

      const memberIds = [...new Set(bookingsData.map(b => b.member_id).filter(Boolean))];

      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, first_name, last_name, email, phone')
        .in('id', memberIds);

      if (membersError) throw membersError;

      // Combine bookings with member and schedule data
      return bookingsData.map(booking => {
        const member = members?.find(m => m.id === booking.member_id);
        const schedule = schedules.find(s => s.id === booking.class_schedule_id);
        return {
          ...booking,
          member,
          schedule
        };
      });
    },
    enabled: open && !!classData?.id,
  });

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!classData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bookings for {classData.name}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total bookings: {bookings?.length || 0}
              </p>
              <Badge variant="outline">
                Capacity: {classData.capacity}
              </Badge>
            </div>

            {!bookings || bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bookings found for this class.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-fitness-red/10 text-fitness-red">
                          {booking.member?.first_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {booking.member?.first_name} {booking.member?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.member?.email}
                        </div>
                        {booking.member?.phone && (
                          <div className="text-xs text-gray-400">
                            {booking.member.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {booking.schedule && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {getDayName(booking.schedule.day_of_week)}
                        </div>
                      )}
                      {booking.schedule && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          {formatTime(booking.schedule.start_time)}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Booked: {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClassBookingsDialog;
