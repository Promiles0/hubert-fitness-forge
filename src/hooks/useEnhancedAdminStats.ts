
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEnhancedAdminStats = () => {
  return useQuery({
    queryKey: ['enhanced-admin-stats'],
    queryFn: async () => {
      console.log('Fetching enhanced admin stats...');
      
      try {
        // Get total members count
        const { count: totalMembers } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true });

        // Get active members count
        const { count: activeMembers } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .eq('is_blocked', false);

        // Get active trainers count
        const { count: activeTrainers } = await supabase
          .from('trainers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Get today's bookings
        const today = new Date().toISOString().split('T')[0];
        const { count: todayBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', `${today}T00:00:00`)
          .lt('created_at', `${today}T23:59:59`);

        // Get current month's payments for revenue
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('amount')
          .gte('payment_date', startOfMonth.toISOString())
          .eq('payment_status', 'successful');

        const monthlyRevenue = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        // Get recent members (last 5)
        const { data: recentMembers } = await supabase
          .from('members')
          .select('first_name, last_name, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        // Get recent bookings (last 5)
        const { data: recentBookings } = await supabase
          .from('bookings')
          .select(`
            created_at,
            members(first_name, last_name),
            class_schedules(
              classes(name)
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Transform bookings data to match expected format
        const transformedBookings = recentBookings?.map(booking => ({
          created_at: booking.created_at,
          members: booking.members,
          classes: {
            name: booking.class_schedules?.classes?.name || 'Unknown Class'
          }
        }));

        const stats = {
          totalMembers: totalMembers || 0,
          activeMembers: activeMembers || 0,
          activeTrainers: activeTrainers || 0,
          todayBookings: todayBookings || 0,
          monthlyRevenue: monthlyRevenue,
          recentMembers: recentMembers || [],
          recentBookings: transformedBookings || []
        };

        console.log('Enhanced admin stats:', stats);
        return stats;
      } catch (error) {
        console.error('Error fetching enhanced admin stats:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
