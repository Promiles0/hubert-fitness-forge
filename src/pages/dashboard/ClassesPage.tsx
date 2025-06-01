
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ClassesPage = () => {
  const upcomingClasses = [
    {
      id: 1,
      name: "HIIT Training",
      instructor: "Michael Thompson",
      date: "2024-03-15",
      time: "6:30 PM",
      duration: "45 min",
      location: "Studio A",
      status: "booked"
    },
    {
      id: 2,
      name: "Yoga Flow",
      instructor: "Sarah Wilson",
      date: "2024-03-16",
      time: "9:00 AM",
      duration: "60 min",
      location: "Studio B",
      status: "booked"
    },
    {
      id: 3,
      name: "Strength Training",
      instructor: "Michael Thompson",
      date: "2024-03-17",
      time: "5:30 PM",
      duration: "60 min",
      location: "Gym Floor",
      status: "booked"
    }
  ];

  const classHistory = [
    {
      id: 1,
      name: "HIIT Training",
      instructor: "Michael Thompson",
      date: "2024-03-10",
      time: "6:30 PM",
      status: "completed",
      rating: 5
    },
    {
      id: 2,
      name: "Yoga Flow",
      instructor: "Sarah Wilson",
      date: "2024-03-09",
      time: "9:00 AM",
      status: "completed",
      rating: 4
    },
    {
      id: 3,
      name: "Strength Training",
      instructor: "Michael Thompson",
      date: "2024-03-08",
      time: "5:30 PM",
      status: "missed",
      rating: null
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "missed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "booked":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completed", className: "bg-green-600" },
      missed: { label: "Missed", className: "bg-red-600" },
      booked: { label: "Booked", className: "bg-blue-600" }
    };
    
    const config = statusConfig[status] || { label: status, className: "bg-gray-600" };
    
    return (
      <Badge className={`${config.className} text-white`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Classes</h1>
        <p className="text-gray-400">View and manage your fitness class bookings</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-fitness-darkGray border-gray-800">
          <TabsTrigger value="upcoming" className="text-white data-[state=active]:bg-fitness-red">
            Upcoming Classes
          </TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-fitness-red">
            Class History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingClasses.map((classItem) => (
              <Card key={classItem.id} className="bg-fitness-darkGray border-gray-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{classItem.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">{classItem.instructor}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="h-4 w-4 text-fitness-red" />
                          <span>{new Date(classItem.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="h-4 w-4 text-fitness-red" />
                          <span>{classItem.time} ({classItem.duration})</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-fitness-red" />
                          <span>{classItem.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(classItem.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {upcomingClasses.length === 0 && (
            <Card className="bg-fitness-darkGray border-gray-800">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Upcoming Classes</h3>
                <p className="text-gray-400 mb-4">You don't have any classes scheduled yet.</p>
                <Button className="bg-fitness-red hover:bg-red-700">Book a Class</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {classHistory.map((classItem) => (
              <Card key={classItem.id} className="bg-fitness-darkGray border-gray-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{classItem.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">{classItem.instructor}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="h-4 w-4 text-fitness-red" />
                          <span>{new Date(classItem.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="h-4 w-4 text-fitness-red" />
                          <span>{classItem.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(classItem.status)}
                        {getStatusBadge(classItem.status)}
                      </div>
                      {classItem.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white text-sm">{classItem.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassesPage;
