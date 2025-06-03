
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Apple, 
  Activity,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const { user } = useAuth();

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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'Member'}!
        </h1>
        <p className="text-gray-400">Here's what's happening with your fitness journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-fitness-darkGray border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-fitness-red" />
              Upcoming Classes
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your next scheduled workouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <h3 className="text-white font-semibold">{classItem.name}</h3>
                  <p className="text-gray-400 text-sm">{classItem.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{classItem.time}</p>
                  <p className="text-gray-400 text-sm">{classItem.date}</p>
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
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Apple className="h-5 w-5 text-fitness-red" />
              Today's Nutrition
            </CardTitle>
            <CardDescription className="text-gray-400">
              Track your daily meal progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {meal.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{meal.type}</h3>
                    <p className="text-gray-400 text-sm">{meal.calories} calories</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={meal.completed ? "border-green-500 text-green-500" : "border-gray-600 text-gray-400"}
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
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Common tasks to help you stay on track
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard/classes">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Calendar className="h-4 w-4 mr-2" />
                Book Class
              </Button>
            </Link>
            <Link to="/dashboard/nutrition">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Apple className="h-4 w-4 mr-2" />
                Log Meal
              </Button>
            </Link>
            <Link to="/dashboard/chat">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Users className="h-4 w-4 mr-2" />
                Message Trainer
              </Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
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
