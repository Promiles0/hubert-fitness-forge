import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Apple, 
  Activity,
  CheckCircle,
  AlertCircle,
  Star,
  Trophy,
  Zap,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          
          // Handle avatar URL
          if (profileData.avatar) {
            if (profileData.avatar.startsWith('http')) {
              setAvatarUrl(profileData.avatar);
            } else if (profileData.avatar.includes('avatars/')) {
              const fileName = profileData.avatar.split('avatars/')[1];
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
              setAvatarUrl(data.publicUrl);
            } else {
              const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(profileData.avatar);
              setAvatarUrl(data.publicUrl);
            }
          }
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Fetch real upcoming classes data
  const { data: upcomingClasses, isLoading: isClassesLoading } = useQuery({
    queryKey: ['upcoming-classes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get member data first
      const { data: memberData } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!memberData) return [];

      // Get upcoming bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, created_at, class_schedule_id')
        .eq('member_id', memberData.id)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!bookingsData || bookingsData.length === 0) return [];

      // Get class schedules for the bookings
      const scheduleIds = bookingsData.map(b => b.class_schedule_id).filter(Boolean);
      if (scheduleIds.length === 0) return [];

      const { data: schedulesData } = await supabase
        .from('class_schedules')
        .select('id, start_time, end_time, class_id')
        .in('id', scheduleIds)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (!schedulesData || schedulesData.length === 0) return [];

      // Get class details
      const classIds = schedulesData.map(s => s.class_id).filter(Boolean);
      const [classesData, trainersData] = await Promise.all([
        supabase
          .from('classes')
          .select('id, name, description, trainer_id')
          .in('id', classIds),
        supabase
          .from('trainers')
          .select('id, first_name, last_name')
      ]);

      // Combine the data
      return schedulesData.map(schedule => {
        const classInfo = classesData.data?.find(c => c.id === schedule.class_id);
        const trainer = trainersData.data?.find(t => t.id === classInfo?.trainer_id);

        return {
          id: schedule.id,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          class: {
            name: classInfo?.name || 'Unknown Class',
            description: classInfo?.description || ''
          },
          trainer: trainer ? {
            first_name: trainer.first_name,
            last_name: trainer.last_name
          } : null
        };
      });
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch real nutrition data
  const { data: todaysMeals, isLoading: isMealsLoading } = useQuery({
    queryKey: ['todays-meals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data: meals } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('time', { ascending: true });

      return meals || [];
    },
    enabled: !!user?.id,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get member data
      const { data: memberData } = await supabase
        .from('members')
        .select('id, created_at')
        .eq('user_id', user.id)
        .single();

      if (!memberData) return null;

      // Get this week's bookings
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { count: weeklyClasses } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', memberData.id)
        .gte('created_at', startOfWeek.toISOString());

      // Get today's calories
      const today = new Date().toISOString().split('T')[0];
      const { data: todayMeals } = await supabase
        .from('meals')
        .select('calories')
        .eq('user_id', user.id)
        .eq('date', today);

      const todayCalories = todayMeals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;

      // Calculate streak (simplified - count recent days with bookings)
      const { count: recentBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', memberData.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      return {
        weeklyClasses: weeklyClasses || 0,
        todayCalories,
        workoutStreak: Math.min(recentBookings || 0, 7),
        memberSince: memberData.created_at
      };
    },
    enabled: !!user?.id,
    refetchInterval: 300000,
  });

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.name) {
      return profile.name;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email?.split('@')[0] || 'Member';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const formatClassTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })} - ${end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  };

  const formatClassDate = (startTime: string) => {
    const date = new Date(startTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const statsCards = [
    {
      title: "Classes This Week",
      value: isStatsLoading ? <LoadingSpinner size={20} /> : (stats?.weeklyClasses || 0).toString(),
      icon: Users,
      trend: `${stats?.weeklyClasses || 0} booked`,
      color: "text-green-500"
    },
    {
      title: "Calories Today",
      value: isStatsLoading ? <LoadingSpinner size={20} /> : (stats?.todayCalories || 0).toString(),
      icon: Apple,
      trend: "Target: 2,000",
      color: "text-blue-500"
    },
    {
      title: "Workout Streak",
      value: isStatsLoading ? <LoadingSpinner size={20} /> : `${stats?.workoutStreak || 0} days`,
      icon: Activity,
      trend: stats?.workoutStreak && stats.workoutStreak > 0 ? "Keep it up!" : "Start today!",
      color: "text-purple-500"
    },
    {
      title: "Member Since",
      value: isStatsLoading ? <LoadingSpinner size={20} /> : stats?.memberSince ? 
        new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'New',
      icon: Target,
      trend: "Active member",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Panel */}
      <Card className="bg-gradient-to-r from-fitness-red to-red-600 text-white border-0 shadow-xl">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 lg:h-24 lg:w-24 ring-4 ring-white/20">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-white/20 text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Good {getTimeOfDay()}, {getDisplayName()}!
                </h1>
                <Zap className="h-6 w-6 text-yellow-300" />
              </div>
              
              <p className="text-white/90 text-lg mb-4">
                Ready to crush your fitness goals today? You've got this! 💪
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                  <Trophy className="h-3 w-3 mr-1" />
                  Active Member
                </Badge>
                {stats?.workoutStreak && stats.workoutStreak > 0 && (
                  <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stats.workoutStreak}-Day Streak
                  </Badge>
                )}
                {profile?.fitness_goals && (
                  <Badge className="bg-green-400/20 text-green-100 border-green-300/30">
                    <Target className="h-3 w-3 mr-1" />
                    {profile.fitness_goals.split(',')[0]}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center lg:items-end gap-3">
              <div className="text-center lg:text-right">
                <p className="text-white/80 text-sm">Today's Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min((stats?.todayCalories || 0) / 2000 * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(Math.min((stats?.todayCalories || 0) / 2000 * 100, 100))}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  asChild
                >
                  <Link to="/dashboard/classes">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Class
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Upcoming Classes */}
        <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-fitness-red" />
              Upcoming Classes
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your next scheduled workouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isClassesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={32} />
              </div>
            ) : upcomingClasses && upcomingClasses.length > 0 ? (
              upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold">
                      {classItem.class.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {classItem.trainer ? `${classItem.trainer.first_name} ${classItem.trainer.last_name}` : 'Instructor TBA'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatClassTime(classItem.start_time, classItem.end_time)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {formatClassDate(classItem.start_time)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No upcoming classes. Book one now to stay on track!
                </p>
                <Link to="/schedule">
                  <Button className="bg-fitness-red hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Book a Class
                  </Button>
                </Link>
              </div>
            )}
            {upcomingClasses && upcomingClasses.length > 0 && (
              <Link to="/dashboard/classes">
                <Button className="w-full bg-fitness-red hover:bg-red-700">
                  View All Classes
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Real Today's Nutrition */}
        <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Apple className="h-5 w-5 text-fitness-red" />
              Today's Nutrition
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Track your daily meal progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isMealsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={32} />
              </div>
            ) : todaysMeals && todaysMeals.length > 0 ? (
              todaysMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold">{meal.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {meal.meal_type} • {meal.calories} calories
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs">
                        {new Date(`2000-01-01T${meal.time}`).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className="border-green-500 text-green-500">
                    Logged
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No meals logged today. Start tracking your nutrition!
                </p>
                <Link to="/dashboard/nutrition">
                  <Button className="bg-fitness-red hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Your First Meal
                  </Button>
                </Link>
              </div>
            )}
            <Link to="/dashboard/nutrition">
              <Button className="w-full bg-fitness-red hover:bg-red-700">
                {todaysMeals && todaysMeals.length > 0 ? 'View Nutrition Plan' : 'Set Up Nutrition'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Common tasks to help you stay on track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard/classes">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Calendar className="h-4 w-4 mr-2" />
                Book Class
              </Button>
            </Link>
            <Link to="/dashboard/nutrition">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Apple className="h-4 w-4 mr-2" />
                Log Meal
              </Button>
            </Link>
            <Link to="/dashboard/chat">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Users className="h-4 w-4 mr-2" />
                Message Trainer
              </Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Target className="h-4 w-4 mr-2" />
                Update Goals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
