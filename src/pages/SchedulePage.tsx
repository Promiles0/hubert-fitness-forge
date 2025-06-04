
import { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScrollIndicator from '@/components/ScrollIndicator';
import PromoBanner from '@/components/PromoBanner';
import CalendarSync from '@/components/CalendarSync';
import BookingConfirmation from '@/components/BookingConfirmation';
import ClassLevelBadge from '@/components/ClassLevelBadge';
import { Filter, Clock, User, MapPin, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Define types
interface FitnessClass {
  id: string;
  name: string;
  trainer: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  date: Date;
  description?: string;
  room?: string;
}

type TimeOfDay = 'All' | 'Morning' | 'Afternoon' | 'Evening';

const SchedulePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [classes, setClasses] = useState<{ [key: string]: FitnessClass[] }>({});
  const [activeTab, setActiveTab] = useState("");
  const [selectedClassType, setSelectedClassType] = useState<string>("All");
  const [selectedTrainer, setSelectedTrainer] = useState<string>("All");
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay>("All");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(null);
  const { isAuthenticated } = useAuth();

  // Get unique class types and trainers for filters
  const allClassTypes = useMemo(() => {
    const types = new Set<string>();
    Object.values(classes).forEach((dayClasses) => {
      dayClasses.forEach((classItem) => {
        types.add(classItem.category);
      });
    });
    return ["All", ...Array.from(types)];
  }, [classes]);

  const allTrainers = useMemo(() => {
    const trainers = new Set<string>();
    Object.values(classes).forEach((dayClasses) => {
      dayClasses.forEach((classItem) => {
        trainers.add(classItem.trainer);
      });
    });
    return ["All", ...Array.from(trainers)];
  }, [classes]);

  useEffect(() => {
    // Generate the next 7 days starting from today
    const generateWeekDays = () => {
      const today = startOfToday();
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        days.push(addDays(today, i));
      }
      
      return days;
    };
    
    const days = generateWeekDays();
    setWeekDays(days);
    setActiveTab(format(days[0], 'yyyy-MM-dd'));
    
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockClassesByDay: { [key: string]: FitnessClass[] } = {};
        
        days.forEach(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayClasses = generateMockClasses(day);
          mockClassesByDay[dateKey] = dayClasses;
        });
        
        setClasses(mockClassesByDay);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load class schedule. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClasses();
  }, []);
  
  // Function to generate mock classes for demo
  const generateMockClasses = (day: Date): FitnessClass[] => {
    const dayOfWeek = format(day, 'EEEE');
    
    const baseClasses = [
      {
        id: `yoga-${dayOfWeek}`,
        name: 'Morning Yoga Flow',
        trainer: 'Michael Chen',
        time: '06:00 AM',
        duration: '60 min',
        capacity: 20,
        enrolled: Math.floor(Math.random() * 18) + 2,
        level: 'All Levels' as const,
        category: 'Yoga',
        timeOfDay: 'Morning' as const,
        date: day,
        description: 'Start your day with energizing yoga flow',
        room: 'Studio A'
      },
      {
        id: `hiit-${dayOfWeek}`,
        name: 'HIIT Cardio Blast',
        trainer: 'Sarah Martinez',
        time: '07:30 AM',
        duration: '45 min',
        capacity: 15,
        enrolled: Math.floor(Math.random() * 13) + 2,
        level: 'Intermediate' as const,
        category: 'HIIT',
        timeOfDay: 'Morning' as const,
        date: day,
        description: 'High-intensity interval training',
        room: 'Gym Floor'
      },
      {
        id: `strength-${dayOfWeek}`,
        name: 'Strength & Conditioning',
        trainer: 'Alex Johnson',
        time: '09:00 AM',
        duration: '60 min',
        capacity: 12,
        enrolled: Math.floor(Math.random() * 10) + 2,
        level: 'Advanced' as const,
        category: 'Strength',
        timeOfDay: 'Morning' as const,
        date: day,
        description: 'Build strength and power',
        room: 'Weight Room'
      },
      {
        id: `spin-${dayOfWeek}`,
        name: 'Spin Cycle',
        trainer: 'Jessica Williams',
        time: '12:00 PM',
        duration: '45 min',
        capacity: 20,
        enrolled: Math.floor(Math.random() * 18) + 2,
        level: 'All Levels' as const,
        category: 'Cardio',
        timeOfDay: 'Afternoon' as const,
        date: day,
        description: 'High-energy cycling workout',
        room: 'Spin Studio'
      },
      {
        id: `pilates-${dayOfWeek}`,
        name: 'Pilates Core Focus',
        trainer: 'Emma Thompson',
        time: '05:30 PM',
        duration: '60 min',
        capacity: 15,
        enrolled: Math.floor(Math.random() * 13) + 2,
        level: 'Beginner' as const,
        category: 'Pilates',
        timeOfDay: 'Evening' as const,
        date: day,
        description: 'Strengthen your core and improve flexibility',
        room: 'Studio B'
      },
      {
        id: `boxing-${dayOfWeek}`,
        name: 'Boxing Cardio',
        trainer: 'James Wilson',
        time: '07:00 PM',
        duration: '60 min',
        capacity: 12,
        enrolled: Math.floor(Math.random() * 10) + 2,
        level: 'Intermediate' as const,
        category: 'Boxing',
        timeOfDay: 'Evening' as const,
        date: day,
        description: 'Learn boxing techniques while getting fit',
        room: 'Boxing Area'
      }
    ];
    
    return baseClasses
      .filter(() => Math.random() > 0.1)
      .sort((a, b) => a.time.localeCompare(b.time));
  };
  
  // Filter classes based on selected filters
  const filteredClasses = useMemo(() => {
    if (!activeTab || !classes[activeTab]) return [];
    
    return classes[activeTab].filter(classItem => {
      const matchesType = selectedClassType === "All" || classItem.category === selectedClassType;
      const matchesTrainer = selectedTrainer === "All" || classItem.trainer === selectedTrainer;
      const matchesTime = selectedTimeOfDay === "All" || classItem.timeOfDay === selectedTimeOfDay;
      
      return matchesType && matchesTrainer && matchesTime;
    });
  }, [classes, activeTab, selectedClassType, selectedTrainer, selectedTimeOfDay]);
  
  const handleBookClass = async (classItem: FitnessClass) => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a class", {
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login",
        },
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Store the booking (for now, we'll use localStorage to simulate)
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const newBooking = {
        id: `booking-${Date.now()}`,
        classId: classItem.id,
        className: classItem.name,
        trainer: classItem.trainer,
        time: classItem.time,
        date: format(classItem.date, 'yyyy-MM-dd'),
        dateFormatted: format(classItem.date, 'EEEE, MMMM d'),
        duration: classItem.duration,
        level: classItem.level,
        category: classItem.category,
        room: classItem.room,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };
      
      existingBookings.push(newBooking);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));
      
      toast.success(`Successfully booked ${classItem.name}!`, {
        description: `${format(classItem.date, 'EEEE, MMMM d')} at ${classItem.time}`
      });
      
      // Update enrolled count
      const updatedClasses = { ...classes };
      const dayKey = format(classItem.date, 'yyyy-MM-dd');
      updatedClasses[dayKey] = updatedClasses[dayKey].map(cls => 
        cls.id === classItem.id ? { ...cls, enrolled: cls.enrolled + 1 } : cls
      );
      setClasses(updatedClasses);
      
    } catch (error) {
      console.error('Error booking class:', error);
      toast.error("Failed to book class. Please try again.");
    }
  };
  
  return (
    <div className="pt-20 bg-gray-50 dark:bg-fitness-dark min-h-screen">
      <PromoBanner />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop" 
            alt="Class Schedule" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              BOOK A <span className="text-fitness-red">CLASS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Find the perfect class to boost your fitness journey and book your spot today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-fitness-red/20 text-fitness-red border-fitness-red">
                <Calendar className="h-4 w-4 mr-2" />
                7 Days Schedule
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500">
                <User className="h-4 w-4 mr-2" />
                Expert Trainers
              </Badge>
            </div>
          </div>
        </div>
        
        <ScrollIndicator />
      </section>

      {/* Schedule Section */}
      <section className="bg-gray-50 dark:bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <SectionTitle 
            title="Weekly Class Schedule" 
            subtitle="Browse our weekly schedule and book your favorite classes. Classes are available for all fitness levels."
            center={true}
          />
          
          {/* Filters */}
          <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 mt-8 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-fitness-red" />
                    <span className="text-sm font-medium mr-2 text-gray-900 dark:text-white">Filter by:</span>
                  </div>
                  
                  <Select value={selectedClassType} onValueChange={setSelectedClassType}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-fitness-darkGray border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Class Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-fitness-darkGray border-gray-300 dark:border-gray-700">
                      {allClassTypes.map(type => (
                        <SelectItem key={type} value={type} className="text-gray-900 dark:text-white focus:bg-fitness-red focus:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-fitness-darkGray border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Trainer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-fitness-darkGray border-gray-300 dark:border-gray-700">
                      {allTrainers.map(trainer => (
                        <SelectItem key={trainer} value={trainer} className="text-gray-900 dark:text-white focus:bg-fitness-red focus:text-white">
                          {trainer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTimeOfDay} onValueChange={(value) => setSelectedTimeOfDay(value as TimeOfDay)}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-fitness-darkGray border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Time of Day" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-fitness-darkGray border-gray-300 dark:border-gray-700">
                      <SelectItem value="All" className="text-gray-900 dark:text-white focus:bg-fitness-red focus:text-white">All Times</SelectItem>
                      <SelectItem value="Morning" className="text-gray-900 dark:text-white focus:bg-fitness-red focus:text-white">Morning</SelectItem>
                      <SelectItem value="Afternoon" className="text-gray-900 dark:text-white focus:bg-fitness-red focus:text-white">Afternoon</SelectItem>
                      <SelectItem value="Evening" className="text-gray-900 dark:text-white focus:bg-fitness-red focus:text-white">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <CalendarSync />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size={40} className="mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading class schedule...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="overflow-x-auto pb-4">
                  <TabsList className="bg-white dark:bg-fitness-darkGray border border-gray-200 dark:border-gray-800 p-1 w-full md:w-auto flex space-x-2">
                    {weekDays.map((day) => (
                      <TabsTrigger 
                        key={format(day, 'yyyy-MM-dd')} 
                        value={format(day, 'yyyy-MM-dd')}
                        className="text-sm px-4 py-3 whitespace-nowrap data-[state=active]:bg-fitness-red data-[state=active]:text-white flex-shrink-0 text-gray-900 dark:text-white"
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-bold">{format(day, 'EEE')}</span>
                          <span className="text-xs opacity-75">{format(day, 'MMM d')}</span>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {weekDays.map((day) => (
                  <TabsContent 
                    key={format(day, 'yyyy-MM-dd')} 
                    value={format(day, 'yyyy-MM-dd')}
                    className="mt-6"
                  >
                    <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                          Schedule For: {format(day, 'EEEE, MMMM d, yyyy')}
                        </h3>
                        
                        {filteredClasses.length ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredClasses.map((classItem) => (
                              <Card 
                                key={classItem.id} 
                                className={`bg-gray-50 dark:bg-fitness-black border transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                                  ${classItem.enrolled >= classItem.capacity ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-800 hover:border-fitness-red dark:hover:border-fitness-red'}
                                `}
                              >
                                <CardContent className="p-6">
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{classItem.name}</h4>
                                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">with {classItem.trainer}</p>
                                      {classItem.description && (
                                        <p className="text-gray-500 dark:text-gray-500 text-xs mb-3">{classItem.description}</p>
                                      )}
                                    </div>
                                    <ClassLevelBadge level={classItem.level} />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center text-sm">
                                        <Clock className="h-4 w-4 mr-2 text-fitness-red" />
                                        <div>
                                          <p className="font-semibold text-gray-900 dark:text-white">{classItem.time}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">{classItem.duration}</p>
                                        </div>
                                      </div>
                                      {classItem.room && (
                                        <div className="flex items-center text-sm">
                                          <MapPin className="h-4 w-4 mr-2 text-fitness-red" />
                                          <p className="text-gray-600 dark:text-gray-400">{classItem.room}</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Availability</p>
                                      <div className="flex items-center justify-end">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                          classItem.enrolled >= classItem.capacity ? 'bg-red-500' : 
                                          classItem.enrolled >= classItem.capacity * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`} />
                                        <p className={`font-semibold ${
                                          classItem.enrolled >= classItem.capacity ? 'text-red-500' : 
                                          classItem.enrolled >= classItem.capacity * 0.8 ? 'text-amber-500' : 'text-emerald-500'
                                        }`}>
                                          {classItem.enrolled}/{classItem.capacity}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    className={`w-full transition-all duration-200 ${
                                      classItem.enrolled >= classItem.capacity 
                                        ? 'bg-gray-400 dark:bg-gray-700 text-gray-300 dark:text-gray-300 cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-700' 
                                        : 'bg-fitness-red hover:bg-red-700 text-white'
                                    }`}
                                    disabled={classItem.enrolled >= classItem.capacity}
                                    onClick={() => handleBookClass(classItem)}
                                  >
                                    {classItem.enrolled >= classItem.capacity ? 'Class Full' : 'Book Now'}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No classes matching your filters for this day.</p>
                            {(selectedClassType !== "All" || selectedTrainer !== "All" || selectedTimeOfDay !== "All") && (
                              <Button 
                                variant="outline" 
                                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                onClick={() => {
                                  setSelectedClassType("All");
                                  setSelectedTrainer("All");
                                  setSelectedTimeOfDay("All");
                                }}
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;
