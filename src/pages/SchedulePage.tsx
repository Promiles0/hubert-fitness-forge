
import { useState, useEffect } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define the class type
interface FitnessClass {
  id: string;
  name: string;
  trainer: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

const SchedulePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [classes, setClasses] = useState<{ [key: string]: FitnessClass[] }>({});
  const [activeTab, setActiveTab] = useState("");
  const { isAuthenticated } = useAuth();

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
  
  // Function to generate mock classes for demo
  const generateMockClasses = (day: Date): FitnessClass[] => {
    const dayOfWeek = format(day, 'EEEE');
    const baseClasses = [
      {
        id: `yoga-${dayOfWeek}`,
        name: 'Yoga Flow',
        trainer: 'Michael Chen',
        time: '06:00 AM',
        duration: '60 min',
        capacity: 20,
        enrolled: Math.floor(Math.random() * 20),
        level: 'All Levels',
      },
      {
        id: `hiit-${dayOfWeek}`,
        name: 'HIIT Circuit',
        trainer: 'Sarah Martinez',
        time: '07:30 AM',
        duration: '45 min',
        capacity: 15,
        enrolled: Math.floor(Math.random() * 15),
        level: 'Intermediate',
      },
      {
        id: `strength-${dayOfWeek}`,
        name: 'Strength Training',
        trainer: 'Alex Johnson',
        time: '09:00 AM',
        duration: '60 min',
        capacity: 12,
        enrolled: Math.floor(Math.random() * 12),
        level: 'Advanced',
      },
      {
        id: `spin-${dayOfWeek}`,
        name: 'Spin Class',
        trainer: 'Jessica Williams',
        time: '12:00 PM',
        duration: '45 min',
        capacity: 20,
        enrolled: Math.floor(Math.random() * 20),
        level: 'All Levels',
      },
      {
        id: `pilates-${dayOfWeek}`,
        name: 'Pilates Core',
        trainer: 'Emma Thompson',
        time: '05:30 PM',
        duration: '60 min',
        capacity: 15,
        enrolled: Math.floor(Math.random() * 15),
        level: 'Beginner',
      },
      {
        id: `boxing-${dayOfWeek}`,
        name: 'Boxing Cardio',
        trainer: 'James Wilson',
        time: '07:00 PM',
        duration: '60 min',
        capacity: 12,
        enrolled: Math.floor(Math.random() * 12),
        level: 'Intermediate',
      },
    ] as FitnessClass[];
    
    // Randomize a bit to make each day slightly different
    return baseClasses
      .filter(() => Math.random() > 0.2) // Randomly remove some classes
      .sort(() => Math.random() - 0.5); // Shuffle the array
  };
  
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
    
    // In a real app, this would make an API call to book the class
    toast.success(`You've successfully booked ${classItem.name} with ${classItem.trainer}`);
  };
  
  return (
    <div className="pt-20"> {/* Adding padding for the fixed navbar */}
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
              CLASS <span className="text-fitness-red">SCHEDULE</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Find the perfect class to boost your fitness journey and book your spot today.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-fitness-black py-16 md:py-24">
        <div className="container-custom">
          <SectionTitle 
            title="Weekly Class Schedule" 
            subtitle="Browse our weekly schedule and book your favorite classes. Classes are available for all fitness levels."
            center={true}
          />
          
          <div className="mt-12">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size={40} className="mb-4" />
                <p className="text-gray-400">Loading class schedule...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="overflow-x-auto pb-4">
                  <TabsList className="bg-fitness-darkGray p-1 w-full md:w-auto">
                    {weekDays.map((day, index) => (
                      <TabsTrigger 
                        key={format(day, 'yyyy-MM-dd')} 
                        value={format(day, 'yyyy-MM-dd')}
                        className="text-sm px-3 py-2 whitespace-nowrap data-[state=active]:bg-fitness-red data-[state=active]:text-white"
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
                        Schedule for {format(day, 'EEEE, MMMM d, yyyy')}
                      </h3>
                      
                      {classes[format(day, 'yyyy-MM-dd')]?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {classes[format(day, 'yyyy-MM-dd')].map((classItem) => (
                            <div 
                              key={classItem.id} 
                              className="bg-fitness-black p-6 rounded-lg border border-gray-800 hover:border-fitness-red transition-colors"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-bold">{classItem.name}</h4>
                                  <p className="text-gray-400">with {classItem.trainer}</p>
                                </div>
                                <div className="bg-fitness-red/10 text-fitness-red px-3 py-1 rounded-full text-xs font-semibold">
                                  {classItem.level}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Time</p>
                                  <p className="font-semibold">{classItem.time}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                                  <p className="font-semibold">{classItem.duration}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Availability</p>
                                  <p className="font-semibold">
                                    {classItem.enrolled}/{classItem.capacity}
                                  </p>
                                </div>
                              </div>
                              
                              <Button 
                                className="w-full bg-fitness-red hover:bg-red-700"
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
                          <p className="text-gray-400">No classes scheduled for this day.</p>
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
    </div>
  );
};

export default SchedulePage;
