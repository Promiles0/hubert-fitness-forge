
import { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfToday, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScrollIndicator from '@/components/ScrollIndicator';
import PromoBanner from '@/components/PromoBanner';
import CalendarSync from '@/components/CalendarSync';
import BookingConfirmation from '@/components/BookingConfirmation';
import ClassLevelBadge from '@/components/ClassLevelBadge';
import { Filter, Clock, Calendar, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      
      // Add today and the next 6 days
      for (let i = 0; i < 7; i++) {
        days.push(addDays(today, i));
      }
      
      return days;
    };
    
    // Set the week days
    const days = generateWeekDays();
    setWeekDays(days);
    
    // Set active tab to today (first day)
    setActiveTab(format(days[0], 'yyyy-MM-dd'));
    
    // Simulate API call to fetch classes
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock classes for each day
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
  
  // Function to categorize time of day
  const getTimeOfDay = (time: string): 'Morning' | 'Afternoon' | 'Evening' => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  // Function to generate mock classes for demo
  const generateMockClasses = (day: Date): FitnessClass[] => {
    const dayOfWeek = format(day, 'EEEE');
    const categories = ['Yoga', 'HIIT', 'Strength', 'Cardio', 'Pilates', 'Boxing', 'Spin', 'Dance'];
    
    const baseClasses = [
      {
        id: `yoga-${dayOfWeek}`,
        name: 'Yoga Flow',
        trainer: 'Michael Chen',
        time: '06:00 AM',
        duration: '60 min',
        capacity: 20,
        enrolled: Math.floor(Math.random() * 20),
        level: 'All Levels' as const,
        category: 'Yoga',
        timeOfDay: 'Morning' as const,
        date: day
      },
      {
        id: `hiit-${dayOfWeek}`,
        name: 'HIIT Circuit',
        trainer: 'Sarah Martinez',
        time: '07:30 AM',
        duration: '45 min',
        capacity: 15,
        enrolled: Math.floor(Math.random() * 15),
        level: 'Intermediate' as const,
        category: 'HIIT',
        timeOfDay: 'Morning' as const,
        date: day
      },
      {
        id: `strength-${dayOfWeek}`,
        name: 'Strength Training',
        trainer: 'Alex Johnson',
        time: '09:00 AM',
        duration: '60 min',
        capacity: 12,
        enrolled: Math.floor(Math.random() * 12),
        level: 'Advanced' as const,
        category: 'Strength',
        timeOfDay: 'Morning' as const,
        date: day
      },
      {
        id: `spin-${dayOfWeek}`,
        name: 'Spin Class',
        trainer: 'Jessica Williams',
        time: '12:00 PM',
        duration: '45 min',
        capacity: 20,
        enrolled: Math.floor(Math.random() * 20),
        level: 'All Levels' as const,
        category: 'Spin',
        timeOfDay: 'Afternoon' as const,
        date: day
      },
      {
        id: `pilates-${dayOfWeek}`,
        name: 'Pilates Core',
        trainer: 'Emma Thompson',
        time: '05:30 PM',
        duration: '60 min',
        capacity: 15,
        enrolled: Math.floor(Math.random() * 15),
        level: 'Beginner' as const,
        category: 'Pilates',
        timeOfDay: 'Evening' as const,
        date: day
      },
      {
        id: `boxing-${dayOfWeek}`,
        name: 'Boxing Cardio',
        trainer: 'James Wilson',
        time: '07:00 PM',
        duration: '60 min',
        capacity: 12,
        enrolled: Math.floor(Math.random() * 12),
        level: 'Intermediate' as const,
        category: 'Boxing',
        timeOfDay: 'Evening' as const,
        date: day
      },
      {
        id: `zumba-${dayOfWeek}`,
        name: 'Zumba Dance',
        trainer: 'Maria Lopez',
        time: '06:00 PM',
        duration: '60 min',
        capacity: 25,
        enrolled: Math.floor(Math.random() * 25),
        level: 'All Levels' as const,
        category: 'Dance',
        timeOfDay: 'Evening' as const,
        date: day
      },
      {
        id: `cardio-${dayOfWeek}`,
        name: 'Cardio Blast',
        trainer: 'David Kim',
        time: '08:00 AM',
        duration: '45 min',
        capacity: 18,
        enrolled: Math.floor(Math.random() * 18),
        level: 'Intermediate' as const,
        category: 'Cardio',
        timeOfDay: 'Morning' as const,
        date: day
      }
    ];
    
    // Randomize a bit to make each day slightly different
    return baseClasses
      .filter(() => Math.random() > 0.2) // Randomly remove some classes
      .sort(() => Math.random() - 0.5); // Shuffle the array
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
  
  const handleBookClass = (classItem: FitnessClass) => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a class", {
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login",
        },
      });
      return;
    }
    
    setSelectedClass(classItem);
    setIsBookingDialogOpen(true);
  };
  
  const confirmBooking = () => {
    if (!selectedClass) return;
    
    // In a real app, this would make an API call to book the class
    toast.success(`You've successfully booked ${selectedClass.name} with ${selectedClass.trainer}`);
    setIsBookingDialogOpen(false);
    setSelectedClass(null);
  };
  
  return (
    <div className="pt-20"> {/* Adding padding for the fixed navbar */}
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop" 
            alt="Class Schedule" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              BOOK A <span className="text-fitness-red">CLASS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Find the perfect class to boost your fitness journey and book your spot today.
            </p>
          </div>
        </div>
        
        <ScrollIndicator />
      </section>

      {/* Schedule Section */}
      <section className="bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <SectionTitle 
            title="Weekly Class Schedule" 
            subtitle="Browse our weekly schedule and book your favorite classes. Classes are available for all fitness levels."
            center={true}
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-fitness-red" />
                <span className="text-sm font-medium mr-2">Filter by:</span>
              </div>
              
              <Select value={selectedClassType} onValueChange={setSelectedClassType}>
                <SelectTrigger className="w-[140px] bg-fitness-darkGray border-gray-700 text-white">
                  <SelectValue placeholder="Class Type" />
                </SelectTrigger>
                <SelectContent className="bg-fitness-darkGray border-gray-700 text-white">
                  {allClassTypes.map(type => (
                    <SelectItem key={type} value={type} className="focus:bg-fitness-red focus:text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger className="w-[140px] bg-fitness-darkGray border-gray-700 text-white">
                  <SelectValue placeholder="Trainer" />
                </SelectTrigger>
                <SelectContent className="bg-fitness-darkGray border-gray-700 text-white">
                  {allTrainers.map(trainer => (
                    <SelectItem key={trainer} value={trainer} className="focus:bg-fitness-red focus:text-white">
                      {trainer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTimeOfDay} onValueChange={(value) => setSelectedTimeOfDay(value as TimeOfDay)}>
                <SelectTrigger className="w-[140px] bg-fitness-darkGray border-gray-700 text-white">
                  <SelectValue placeholder="Time of Day" />
                </SelectTrigger>
                <SelectContent className="bg-fitness-darkGray border-gray-700 text-white">
                  <SelectItem value="All" className="focus:bg-fitness-red focus:text-white">All Times</SelectItem>
                  <SelectItem value="Morning" className="focus:bg-fitness-red focus:text-white">Morning</SelectItem>
                  <SelectItem value="Afternoon" className="focus:bg-fitness-red focus:text-white">Afternoon</SelectItem>
                  <SelectItem value="Evening" className="focus:bg-fitness-red focus:text-white">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CalendarSync />
          </div>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size={40} className="mb-4" />
                <p className="text-gray-400">Loading class schedule...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="overflow-x-auto pb-4">
                  <TabsList className="bg-fitness-darkGray p-1 w-full md:w-auto flex space-x-2">
                    {weekDays.map((day, index) => (
                      <TabsTrigger 
                        key={format(day, 'yyyy-MM-dd')} 
                        value={format(day, 'yyyy-MM-dd')}
                        className="text-sm px-2 py-2 whitespace-nowrap data-[state=active]:bg-fitness-red data-[state=active]:text-white flex-shrink-0"
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-bold">{format(day, 'EEE')}</span>
                          <span className="text-xs">{format(day, 'MMM d')}</span>
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
                    <div className="bg-fitness-darkGray rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-6 text-center">
                        Schedule For: {format(day, 'EEEE, MMMM d, yyyy')}
                      </h3>
                      
                      {filteredClasses.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredClasses.map((classItem) => (
                            <div 
                              key={classItem.id} 
                              className={`bg-fitness-black p-6 rounded-lg border hover:border-fitness-red transition-colors
                                ${classItem.enrolled >= classItem.capacity ? 'border-red-800' : 'border-gray-800'}
                              `}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-bold">{classItem.name}</h4>
                                  <p className="text-gray-400">with {classItem.trainer}</p>
                                </div>
                                <ClassLevelBadge level={classItem.level} />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Time</p>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1 text-fitness-red" />
                                    <p className="font-semibold">{classItem.time}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                                  <p className="font-semibold">{classItem.duration}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Availability</p>
                                  <p className={`font-semibold ${classItem.enrolled >= classItem.capacity ? 'text-red-500' : classItem.enrolled >= classItem.capacity * 0.8 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {classItem.enrolled}/{classItem.capacity}
                                  </p>
                                </div>
                              </div>
                              
                              <Button 
                                className={`w-full ${classItem.enrolled >= classItem.capacity 
                                  ? 'bg-gray-700 text-gray-300 cursor-not-allowed hover:bg-gray-700' 
                                  : 'bg-fitness-red hover:bg-red-700'}`}
                                disabled={classItem.enrolled >= classItem.capacity}
                                onClick={() => handleBookClass(classItem)}
                              >
                                {classItem.enrolled >= classItem.capacity ? 'Class Full' : 'Book Now'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-400">No classes matching your filters for this day.</p>
                          {(selectedClassType !== "All" || selectedTrainer !== "All" || selectedTimeOfDay !== "All") && (
                            <Button 
                              variant="outline" 
                              className="mt-4 border-gray-700"
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
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </section>
      
      {/* Booking Confirmation Dialog */}
      <BookingConfirmation 
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        classItem={selectedClass}
        onConfirm={confirmBooking}
      />
    </div>
  );
};

export default SchedulePage;
