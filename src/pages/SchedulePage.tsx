
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatTimeForDisplay } from "@/utils/timeUtils";

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const { data: classes, isLoading } = useQuery({
    queryKey: ['schedule', selectedDay],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_schedules')
        .select(`
          *,
          classes!inner(
            name,
            description,
            class_type,
            capacity,
            duration_minutes,
            room,
            trainers(first_name, last_name)
          )
        `)
        .eq('day_of_week', selectedDay)
        .order('start_time');

      if (error) throw error;
      return data;
    },
  });

  const weekDays = [
    { name: "Sunday", value: 0 },
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 },
    { name: "Saturday", value: 6 }
  ];

  const getClassTypeColor = (type: string) => {
    const colors = {
      yoga: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      hiit: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      cardio: "bg-red-500/10 text-red-400 border-red-500/20",
      strength: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      pilates: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      zumba: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return colors[type.toLowerCase()] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-fitness-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Class Schedule
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join our fitness classes and take your workout to the next level
          </p>
        </div>

        {/* Day Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {weekDays.map((day) => (
            <Button
              key={day.value}
              variant={selectedDay === day.value ? "default" : "outline"}
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                selectedDay === day.value 
                  ? "bg-fitness-red hover:bg-red-700 shadow-lg shadow-red-500/25" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
              }`}
              onClick={() => setSelectedDay(day.value)}
            >
              {day.name}
            </Button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes && classes.length > 0 ? (
            classes.map((schedule) => (
              <Card key={schedule.id} className="group bg-gradient-to-br from-fitness-darkGray to-gray-900 border-gray-800 hover:border-fitness-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fitness-red/10 hover:-translate-y-1 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl font-bold mb-2 group-hover:text-fitness-red transition-colors">
                        {schedule.classes.name}
                      </CardTitle>
                      <Badge className={`${getClassTypeColor(schedule.classes.class_type)} border font-medium px-3 py-1`}>
                        {schedule.classes.class_type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="bg-fitness-red/10 p-2 rounded-full">
                      <Star className="h-5 w-5 text-fitness-red" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {schedule.classes.description}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="bg-fitness-red/10 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-fitness-red" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {formatTimeForDisplay(schedule.start_time)} - {formatTimeForDisplay(schedule.end_time)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {schedule.classes.duration_minutes} minutes
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="bg-fitness-red/10 p-2 rounded-full">
                          <Users className="h-4 w-4 text-fitness-red" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            Max {schedule.classes.capacity} spots
                          </div>
                          <div className="text-xs text-gray-400">
                            Available now
                          </div>
                        </div>
                      </div>
                      
                      {schedule.classes.room && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="bg-fitness-red/10 p-2 rounded-full">
                            <MapPin className="h-4 w-4 text-fitness-red" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {schedule.classes.room}
                            </div>
                            <div className="text-xs text-gray-400">
                              Studio location
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {schedule.classes.trainers && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-fitness-red/5 to-transparent rounded-lg border border-fitness-red/10">
                        <div className="w-10 h-10 bg-fitness-red rounded-full flex items-center justify-center text-white font-bold">
                          {schedule.classes.trainers.first_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {schedule.classes.trainers.first_name} {schedule.classes.trainers.last_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Certified Trainer
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full bg-fitness-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 group-hover:scale-[1.02]">
                    Book Class
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-gray-900/50 rounded-2xl p-12 max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-300 mb-3">
                  No Classes Scheduled
                </h3>
                <p className="text-gray-500 text-lg">
                  No classes are scheduled for {weekDays.find(d => d.value === selectedDay)?.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
