
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
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

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="min-h-screen bg-fitness-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Class Schedule</h1>
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
              className={`${
                selectedDay === day.value 
                  ? "bg-fitness-red hover:bg-red-700" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
              onClick={() => setSelectedDay(day.value)}
            >
              {day.name}
            </Button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes && classes.length > 0 ? (
            classes.map((schedule) => (
              <Card key={schedule.id} className="bg-fitness-darkGray border-gray-800 hover:border-fitness-red transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">
                      {schedule.classes.name}
                    </CardTitle>
                    <Badge className="bg-fitness-red">
                      {schedule.classes.class_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400">{schedule.classes.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTimeForDisplay(schedule.start_time)} - {formatTimeForDisplay(schedule.end_time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="h-4 w-4" />
                      <span>Max {schedule.classes.capacity} participants</span>
                    </div>
                    
                    {schedule.classes.room && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span>{schedule.classes.room}</span>
                      </div>
                    )}
                    
                    {schedule.classes.trainers && (
                      <div className="text-gray-300">
                        <span className="font-medium">Trainer: </span>
                        {schedule.classes.trainers.first_name} {schedule.classes.trainers.last_name}
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full bg-fitness-red hover:bg-red-700">
                    Book Class
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Classes Scheduled
              </h3>
              <p className="text-gray-500">
                No classes are scheduled for {weekDays.find(d => d.value === selectedDay)?.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
