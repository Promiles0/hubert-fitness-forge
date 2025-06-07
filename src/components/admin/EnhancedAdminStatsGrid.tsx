
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Award, DollarSign, TrendingUp, Activity } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface EnhancedAdminStatsGridProps {
  stats: {
    totalMembers: number;
    activeMembers: number;
    todayBookings: number;
    activeTrainers: number;
    monthlyRevenue: number;
  } | undefined;
  isLoading: boolean;
}

const EnhancedAdminStatsGrid = ({ stats, isLoading }: EnhancedAdminStatsGridProps) => {
  const statsCards = [
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      subtitle: `${stats?.activeMembers || 0} active`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-white/20",
      trend: "+12%"
    },
    {
      title: "Today's Bookings",
      value: stats?.todayBookings || 0,
      subtitle: "Classes booked",
      icon: Calendar,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-white/20",
      trend: "+8%"
    },
    {
      title: "Active Trainers",
      value: stats?.activeTrainers || 0,
      subtitle: "Staff ready",
      icon: Award,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-white/20",
      trend: "+2"
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`,
      subtitle: "This month",
      icon: DollarSign,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-white/20",
      trend: "+15%"
    },
    {
      title: "Growth Rate",
      value: "18.2%",
      subtitle: "vs last month",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-white/20",
      trend: "+3.2%"
    },
    {
      title: "System Health",
      value: "99.9%",
      subtitle: "Uptime",
      icon: Activity,
      gradient: "from-cyan-500 to-cyan-600",
      bgColor: "bg-white/20",
      trend: "Stable"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((card, index) => (
        <Card key={index} className={`bg-gradient-to-br ${card.gradient} text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white/80 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold mt-1">
                  {isLoading ? <LoadingSpinner size={24} /> : card.value}
                </p>
                <p className="text-white/70 text-xs mt-1">
                  {card.subtitle}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {card.trend}
                  </span>
                </div>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedAdminStatsGrid;
