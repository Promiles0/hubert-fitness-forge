
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
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

  // Mock data for demonstration
  const upcomingClasses = [
    {
      id: 1,
      name: "HIIT Training",
      instructor: "Michael Thompson",
      time: "6:30 PM",
      date: "Today"
    },
    {
      id: 2,
      name: "Yoga Flow",
      instructor: "Sarah Wilson",
      time: "9:00 AM",
      date: "Tomorrow"
    }
  ];

  const todaysMeals = [
    { type: "Breakfast", calories: 350, completed: true },
    { type: "Lunch", calories: 520, completed: true },
    { type: "Dinner", calories: 480, completed: false },
    { type: "Snack", calories: 150, completed: false }
  ];

  const stats = [
    {
      title: "Classes This Week",
      value: "4",
      icon: Users,
      trend: "+2 from last week",
      color: "text-green-500"
    },
    {
      title: "Calories Today",
      value: "870",
      icon: Apple,
      trend: "Target: 1,500",
      color: "text-blue-500"
    },
    {
      title: "Workout Streak",
      value: "7 days",
      icon: Activity,
      trend: "Personal best!",
      color: "text-purple-500"
    },
    {
      title: "Goals Completed",
      value: "3/5",
      icon: Target,
      trend: "60% complete",
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
                <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  7-Day Streak
                </Badge>
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
                    <div className="w-3/4 h-full bg-yellow-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
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
        {stats.map((stat, index) => (
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
        {/* Upcoming Classes */}
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
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-semibold">{classItem.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{classItem.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white font-medium">{classItem.time}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{classItem.date}</p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/classes">
              <Button className="w-full bg-fitness-red hover:bg-red-700">
                View All Classes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's Nutrition */}
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
            {todaysMeals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {meal.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold">{meal.type}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{meal.calories} calories</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={meal.completed ? "border-green-500 text-green-500" : "border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400"}
                >
                  {meal.completed ? "Complete" : "Pending"}
                </Badge>
              </div>
            ))}
            <Link to="/dashboard/nutrition">
              <Button className="w-full bg-fitness-red hover:bg-red-700">
                View Nutrition Plan
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
