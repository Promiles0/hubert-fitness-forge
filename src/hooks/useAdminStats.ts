
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-comprehensive-stats'],
    queryFn: async () => {
      // Get member statistics
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      
      const { count: activeMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get class statistics
      const { count: totalClasses } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: todayBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      // Get trainer statistics
      const { count: activeTrainers } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get revenue statistics
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'successful')
        .gte('payment_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`);
      
      const monthlyRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Get recent activity
      const { data: recentMembers } = await supabase
        .from('members')
        .select('first_name, last_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent bookings with member and class info
      const { data: recentBookingsData } = await supabase
        .from('bookings')
        .select(`
          created_at,
          members!inner(first_name, last_name),
          class_schedules!inner(
            classes!inner(name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Transform the booking data to match expected format
      const recentBookings = recentBookingsData?.map(booking => ({
        created_at: booking.created_at,
        members: {
          first_name: booking.members?.first_name || 'Unknown',
          last_name: booking.members?.last_name || 'Member'
        },
        classes: {
          name: booking.class_schedules?.classes?.name || 'Unknown Class'
        }
      })) || [];

      // Get recent messages
      const { data: recentMessages } = await supabase
        .from('messages')
        .select('subject, content, created_at, message_type')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        totalClasses: totalClasses || 0,
        todayBookings: todayBookings || 0,
        activeTrainers: activeTrainers || 0,
        monthlyRevenue,
        recentMembers: recentMembers || [],
        recentBookings: recentBookings || [],
        recentMessages: recentMessages || []
      };
    },
    refetchInterval: 30000,
  });
};
