
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, Calendar, DollarSign, AlertTriangle, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminStatsCards = () => {
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        // Get count of all profiles (representing members)
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setTotalMembers(count || 0);
      } catch (error) {
        console.error('Error fetching member count:', error);
        setTotalMembers(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberCount();
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: "Total Members",
      value: isLoading ? "Loading..." : totalMembers?.toString() || "0",
      icon: <Users className="h-10 w-10 text-blue-500" />,
      color: "bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Active Memberships",
      value: "897",
      icon: <Activity className="h-10 w-10 text-green-500" />,
      color: "bg-green-500/10 border-green-500/20"
    },
    {
      title: "Today's Bookings",
      value: "53",
      icon: <Calendar className="h-10 w-10 text-purple-500" />,
      color: "bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Ongoing Classes",
      value: "6",
      icon: <Dumbbell className="h-10 w-10 text-yellow-500" />,
      color: "bg-yellow-500/10 border-yellow-500/20"
    },
    {
      title: "Monthly Revenue",
      value: "$12,300",
      icon: <DollarSign className="h-10 w-10 text-emerald-500" />,
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Pending Approvals",
      value: "4",
      icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
      color: "bg-red-500/10 border-red-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsCards.map((card, index) => (
        <Card key={index} className={`bg-fitness-darkGray border ${card.color}`}>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="mt-2 mb-1">{card.icon}</div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
