
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClassesStatsCardsProps {
  classes: any[];
}

const ClassesStatsCards = ({ classes }: ClassesStatsCardsProps) => {
  // Fetch bookings count for stats
  const { data: bookingsCounts } = useQuery({
    queryKey: ['admin-bookings-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('class_schedule_id')
        .eq('status', 'confirmed');

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach(booking => {
        if (booking.class_schedule_id) {
          counts[booking.class_schedule_id] = (counts[booking.class_schedule_id] || 0) + 1;
        }
      });

      return counts;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-blue-600">
            {classes?.length || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-green-600">
            {classes?.reduce((sum, cls) => sum + (cls.capacity || 0), 0) || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-orange-600">
            {Object.values(bookingsCounts || {}).reduce((sum, count) => sum + count, 0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-purple-600">
            {classes?.filter(cls => cls.class_schedules && cls.class_schedules.length > 0).length || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Classes</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesStatsCards;
