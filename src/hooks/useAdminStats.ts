
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

      // Fixed query for recent bookings - using separate queries to avoid relationship issues
      const { data: recentBookingsData } = await supabase
        .from('bookings')
        .select('created_at, member_id, class_schedule_id')
        .order('created_at', { ascending: false })
        .limit(5);

      let recentBookings = [];
      if (recentBookingsData && recentBookingsData.length > 0) {
        // Get member and class details separately
        const memberIds = recentBookingsData.map(b => b.member_id).filter(Boolean);
        const scheduleIds = recentBookingsData.map(b => b.class_schedule_id).filter(Boolean);

        const [membersData, schedulesData] = await Promise.all([
          memberIds.length > 0 ? supabase
            .from('members')
            .select('id, first_name, last_name')
            .in('id', memberIds) : Promise.resolve({ data: [] }),
          scheduleIds.length > 0 ? supabase
            .from('class_schedules')
            .select('id, class_id')
            .in('id', scheduleIds) : Promise.resolve({ data: [] })
        ]);

        // Get class details if we have schedules
        let classesData = { data: [] };
        if (schedulesData.data && schedulesData.data.length > 0) {
          const classIds = schedulesData.data.map(s => s.class_id).filter(Boolean);
          if (classIds.length > 0) {
            classesData = await supabase
              .from('classes')
              .select('id, name')
              .in('id', classIds);
          }
        }

        // Combine the data
        recentBookings = recentBookingsData.map(booking => {
          const member = membersData.data?.find(m => m.id === booking.member_id);
          const schedule = schedulesData.data?.find(s => s.id === booking.class_schedule_id);
          const classInfo = schedule ? classesData.data?.find(c => c.id === schedule.class_id) : null;

          return {
            created_at: booking.created_at,
            members: member || { first_name: 'Unknown', last_name: 'Member' },
            classes: classInfo || { name: 'Unknown Class' }
          };
        });
      }

      return {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        totalClasses: totalClasses || 0,
        todayBookings: todayBookings || 0,
        activeTrainers: activeTrainers || 0,
        monthlyRevenue,
        recentMembers: recentMembers || [],
        recentBookings: recentBookings || []
      };
    },
    refetchInterval: 30000,
  });
};
