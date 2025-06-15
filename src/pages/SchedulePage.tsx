
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Star, Zap, Heart } from "lucide-react";
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
      yoga: "bg-purple-500/10 text-purple-300 border-purple-400/30 shadow-purple-500/20",
      hiit: "bg-orange-500/10 text-orange-300 border-orange-400/30 shadow-orange-500/20",
      cardio: "bg-red-500/10 text-red-300 border-red-400/30 shadow-red-500/20",
      strength: "bg-blue-500/10 text-blue-300 border-blue-400/30 shadow-blue-500/20",
      pilates: "bg-pink-500/10 text-pink-300 border-pink-400/30 shadow-pink-500/20",
      zumba: "bg-green-500/10 text-green-300 border-green-400/30 shadow-green-500/20",
    };
    return colors[type.toLowerCase()] || "bg-gray-500/10 text-gray-300 border-gray-400/30";
  };

  const getIntensityIcon = (type: string) => {
    const icons = {
      yoga: Heart,
      hiit: Zap,
      cardio: Zap,
      strength: Zap,
      pilates: Heart,
      zumba: Star,
    };
    const IconComponent = icons[type.toLowerCase()] || Star;
    return <IconComponent className="h-4 w-4" />;
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-black via-gray-950 to-fitness-darkGray text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-fitness-red/5 via-transparent to-fitness-red/5 blur-3xl -z-10"></div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            Class Schedule
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Discover your perfect workout with our premium fitness classes
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-fitness-red to-red-400 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Enhanced Day Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {weekDays.map((day) => (
            <Button
              key={day.value}
              variant={selectedDay === day.value ? "default" : "outline"}
              className={`relative px-8 py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-500 transform hover:scale-105 ${
                selectedDay === day.value 
                  ? "bg-gradient-to-r from-fitness-red to-red-600 text-white shadow-2xl shadow-red-500/30 border-0" 
                  : "border-2 border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 hover:border-fitness-red/50 hover:text-white backdrop-blur-sm"
              }`}
              onClick={() => setSelectedDay(day.value)}
            >
              <span className="relative z-10">{day.name}</span>
              {selectedDay === day.value && (
                <div className="absolute inset-0 bg-gradient-to-r from-fitness-red/20 to-red-600/20 rounded-md blur-xl"></div>
              )}
            </Button>
          ))}
        </div>

        {/* Enhanced Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes && classes.length > 0 ? (
            classes.map((schedule) => (
              <Card key={schedule.id} className="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 border-0 hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden backdrop-blur-xl">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-fitness-red/20 via-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                <div className="absolute inset-[1px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg"></div>
                
                <div className="relative z-10">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-white text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-fitness-red group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-500">
                          {schedule.classes.name}
                        </CardTitle>
                        <Badge className={`${getClassTypeColor(schedule.classes.class_type)} border-2 font-bold px-4 py-2 text-xs uppercase tracking-wider shadow-lg`}>
                          <span className="flex items-center gap-2">
                            {getIntensityIcon(schedule.classes.class_type)}
                            {schedule.classes.class_type}
                          </span>
                        </Badge>
                      </div>
                      <div className="bg-gradient-to-br from-fitness-red/20 to-red-600/20 p-3 rounded-full border border-fitness-red/30 group-hover:scale-110 transition-transform duration-500">
                        <Star className="h-6 w-6 text-fitness-red group-hover:text-yellow-400 transition-colors duration-500" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                      {schedule.classes.description}
                    </p>
                    
                    {/* Enhanced Info Grid */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="bg-gradient-to-br from-fitness-red/20 to-red-600/20 p-3 rounded-full border border-fitness-red/30">
                              <Clock className="h-5 w-5 text-fitness-red" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold text-lg">
                                {formatTimeForDisplay(schedule.start_time)} - {formatTimeForDisplay(schedule.end_time)}
                              </div>
                              <div className="text-xs text-gray-400 font-medium">
                                {schedule.classes.duration_minutes} minutes session
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-full border border-blue-500/30">
                              <Users className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold">
                                Max {schedule.classes.capacity} participants
                              </div>
                              <div className="text-xs text-green-400 font-medium">
                                ✓ Spots available
                              </div>
                            </div>
                          </div>
                          
                          {schedule.classes.room && (
                            <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-3 rounded-full border border-purple-500/30">
                                <MapPin className="h-5 w-5 text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <div className="text-white font-semibold">
                                  {schedule.classes.room}
                                </div>
                                <div className="text-xs text-gray-400 font-medium">
                                  Premium studio space
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Trainer Card */}
                      {schedule.classes.trainers && (
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-fitness-red/10 via-red-500/5 to-fitness-red/10 rounded-xl border border-fitness-red/20 backdrop-blur-sm group-hover:border-fitness-red/40 transition-all duration-500">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-fitness-red to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {schedule.classes.trainers.first_name.charAt(0)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-semibold text-lg">
                              {schedule.classes.trainers.first_name} {schedule.classes.trainers.last_name}
                            </div>
                            <div className="text-xs text-fitness-red font-medium">
                              ⭐ Certified Professional Trainer
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced CTA Button */}
                    <Button className="w-full bg-gradient-to-r from-fitness-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 text-lg rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/30 group-hover:scale-[1.02] border-0 relative overflow-hidden">
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Star className="h-5 w-5" />
                        Reserve Your Spot
                      </span>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-3xl p-16 max-w-lg mx-auto border border-gray-700/50 backdrop-blur-xl">
                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-200 mb-4">
                  No Classes Today
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  No classes are scheduled for {weekDays.find(d => d.value === selectedDay)?.name}. 
                  <br />Check other days for available sessions.
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
