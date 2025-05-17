
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, User, Filter, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

// Schedule day tab component
const DayTab = ({ 
  day, 
  isActive, 
  onClick 
}: { 
  day: { 
    name: string; 
    shortName: string; 
    date: string; 
    isToday?: boolean; 
  }; 
  isActive: boolean; 
  onClick: () => void; 
}) => {
  return (
    <button
      className={`flex flex-col items-center px-4 py-3 rounded-lg transition ${
        isActive 
          ? 'bg-fitness-red text-white' 
          : 'bg-fitness-darkGray text-gray-300 hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <span className="text-sm font-medium">{day.shortName}</span>
      <span className="text-lg font-bold">{day.date}</span>
      {day.isToday && (
        <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-fitness-red'}`}>Today</span>
      )}
    </button>
  );
};

// Class card component
const ClassCard = ({ 
  classInfo,
  onBook
}: { 
  classInfo: {
    id: string;
    name: string;
    time: string;
    duration: string;
    trainer: string;
    capacity: number;
    booked: number;
    level: string;
    location: string;
  };
  onBook: () => void;
}) => {
  const { isAuthenticated } = useAuth();
  const availability = classInfo.capacity - classInfo.booked;
  const isFull = availability <= 0;
  
  return (
    <div className="bg-fitness-darkGray rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white">{classInfo.name}</h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{classInfo.time} ({classInfo.duration})</span>
            </div>
          </div>
          
          <Badge className={`${isFull ? 'bg-red-800 hover:bg-red-800' : 'bg-green-800 hover:bg-green-800'}`}>
            {isFull ? 'Full' : `${availability} spots left`}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Trainer</p>
            <div className="flex items-center">
              <User className="h-4 w-4 text-fitness-red mr-1" />
              <p className="text-sm text-gray-300">{classInfo.trainer}</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Level</p>
            <p className="text-sm text-gray-300">{classInfo.level}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm text-gray-300">{classInfo.location}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Capacity</p>
            <p className="text-sm text-gray-300">{classInfo.booked}/{classInfo.capacity}</p>
          </div>
        </div>
        
        <Button 
          className={`w-full ${isFull ? 'bg-gray-700 hover:bg-gray-700 cursor-not-allowed' : 'bg-fitness-red hover:bg-red-700'}`}
          disabled={isFull}
          onClick={onBook}
        >
          {isFull ? 'Class Full' : (isAuthenticated ? 'Book Now' : 'Login to Book')}
        </Button>
      </div>
    </div>
  );
};

const SchedulePage = () => {
  const { isAuthenticated } = useAuth();
  
  // State for active day tab
  const [activeDay, setActiveDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [classType, setClassType] = useState("all");
  const [timeOfDay, setTimeOfDay] = useState("all");
  
  // Generate week dates
  const getCurrentWeekDays = () => {
    const days = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        shortName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString(),
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    
    return days;
  };
  
  const weekDays = getCurrentWeekDays();
  
  // Mock classes data - in a real app, this would be fetched from an API
  const mockClasses = [
    {
      id: "1",
      name: "HIIT Blast",
      time: "06:00 AM",
      duration: "45 min",
      trainer: "Sarah Martinez",
      capacity: 20,
      booked: 15,
      level: "Intermediate",
      location: "Studio A",
      days: [1, 3, 5] // Monday, Wednesday, Friday
    },
    {
      id: "2",
      name: "Yoga Flow",
      time: "07:00 AM",
      duration: "60 min",
      trainer: "Michael Chen",
      capacity: 15,
      booked: 12,
      level: "All Levels",
      location: "Studio B",
      days: [0, 2, 4, 6] // Sunday, Tuesday, Thursday, Saturday
    },
    {
      id: "3",
      name: "Spin Class",
      time: "08:30 AM",
      duration: "45 min",
      trainer: "Emma Rodriguez",
      capacity: 12,
      booked: 12,
      level: "Intermediate",
      location: "Spin Room",
      days: [1, 2, 3, 4, 5] // Weekdays
    },
    {
      id: "4",
      name: "Strength & Conditioning",
      time: "10:00 AM",
      duration: "60 min",
      trainer: "Alex Johnson",
      capacity: 15,
      booked: 8,
      level: "Advanced",
      location: "Main Floor",
      days: [0, 2, 4, 6] // Sunday, Tuesday, Thursday, Saturday
    },
    {
      id: "5",
      name: "Pilates",
      time: "12:00 PM",
      duration: "50 min",
      trainer: "Lisa Wong",
      capacity: 12,
      booked: 6,
      level: "All Levels",
      location: "Studio B",
      days: [1, 3, 5] // Monday, Wednesday, Friday
    },
    {
      id: "6",
      name: "Boxing Basics",
      time: "05:30 PM",
      duration: "60 min",
      trainer: "Mike Tyson",
      capacity: 15,
      booked: 13,
      level: "Beginner",
      location: "Boxing Area",
      days: [1, 3, 5] // Monday, Wednesday, Friday
    },
    {
      id: "7",
      name: "CrossFit WOD",
      time: "06:30 PM",
      duration: "60 min",
      trainer: "Emma Rodriguez",
      capacity: 12,
      booked: 9,
      level: "Advanced",
      location: "CrossFit Box",
      days: [0, 1, 2, 3, 4, 5, 6] // Every day
    },
    {
      id: "8",
      name: "Zumba",
      time: "07:30 PM",
      duration: "45 min",
      trainer: "Maria Garcia",
      capacity: 25,
      booked: 20,
      level: "All Levels",
      location: "Studio A",
      days: [2, 4] // Tuesday, Thursday
    }
  ];

  // Filter classes based on selected day
  const filteredClasses = mockClasses.filter(cls => {
    // Filter by day
    if (!cls.days.includes(activeDay)) return false;
    
    // Filter by class type
    if (classType !== "all") {
      const classTypeMap: Record<string, string[]> = {
        "hiit": ["HIIT Blast"],
        "yoga": ["Yoga Flow", "Pilates"],
        "cardio": ["Spin Class", "Zumba"],
        "strength": ["Strength & Conditioning", "CrossFit WOD"],
        "combat": ["Boxing Basics"]
      };
      
      if (!classTypeMap[classType].includes(cls.name)) return false;
    }
    
    // Filter by time of day
    if (timeOfDay !== "all") {
      const hour = parseInt(cls.time.split(':')[0]);
      const isPM = cls.time.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
      
      const timeRanges: Record<string, [number, number]> = {
        "morning": [5, 11], // 5:00 AM - 11:59 AM
        "afternoon": [12, 16], // 12:00 PM - 4:59 PM
        "evening": [17, 22] // 5:00 PM - 10:59 PM
      };
      
      const [min, max] = timeRanges[timeOfDay];
      if (hour24 < min || hour24 > max) return false;
    }
    
    return true;
  });

  // Handle booking a class
  const handleBookClass = (classInfo: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book a class",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Class Booked!",
        description: `You've successfully booked ${classInfo.name} at ${classInfo.time}`,
      });
      setIsLoading(false);
    }, 1000);
  };

  // Animation on scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animated');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" 
            alt="Schedule Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              BOOK A <span className="text-fitness-red">CLASS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Find the perfect class that fits your schedule and fitness goals
            </p>
            <div className="flex animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link to="#free-class" className="mx-auto">
                <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                  Try Your First Class Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="bg-fitness-black py-20">
        <div className="container-custom">
          <SectionTitle 
            title="Class Schedule" 
            subtitle="Find and book your favorite classes for the week"
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          {/* Day selector */}
          <div className="grid grid-cols-7 gap-2 mb-8 animate-on-scroll">
            {weekDays.map((day, index) => (
              <DayTab 
                key={index}
                day={day}
                isActive={activeDay === index}
                onClick={() => setActiveDay(index)}
              />
            ))}
          </div>
          
          {/* Filters */}
          <div className="bg-fitness-darkGray rounded-lg p-5 mb-8 animate-on-scroll">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-fitness-red" />
              <h3 className="text-lg font-bold text-white">Filter Classes</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Class Type</label>
                <Select value={classType} onValueChange={setClassType}>
                  <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-fitness-black border-gray-700 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="yoga">Yoga & Pilates</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="combat">Combat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Time of Day</label>
                <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                  <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                    <SelectValue placeholder="All Times" />
                  </SelectTrigger>
                  <SelectContent className="bg-fitness-black border-gray-700 text-white">
                    <SelectItem value="all">All Times</SelectItem>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="Search classes or trainers..."
                    className="pl-10 bg-fitness-black border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Classes grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-fitness-red animate-spin" />
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
              {filteredClasses.map(classInfo => (
                <ClassCard 
                  key={classInfo.id} 
                  classInfo={classInfo} 
                  onBook={() => handleBookClass(classInfo)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-fitness-darkGray rounded-lg p-10 animate-on-scroll">
              <h3 className="text-xl font-bold text-white mb-2">No Classes Found</h3>
              <p className="text-gray-400 mb-4">There are no classes matching your filters on this day.</p>
              <Button onClick={() => {setClassType("all"); setTimeOfDay("all");}} variant="outline" className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Free Trial Section */}
      <section id="free-class" className="bg-gradient-to-b from-fitness-black to-fitness-darkGray py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll order-2 lg:order-1">
              <SectionTitle 
                title="Try Your First Class Free" 
                subtitle="Experience the energy, expertise, and community that makes our classes special."
                center={false}
              />
              
              <p className="text-gray-300 mb-6">
                Not sure which class is right for you? We invite you to try any class of your choice absolutely free. Our instructors will guide you through the workout, ensuring proper form and answering any questions you might have.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Choose Any Class</h4>
                    <p className="text-gray-400">From HIIT to yoga, you can try any regularly scheduled class on our timetable.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Equipment Provided</h4>
                    <p className="text-gray-400">Just bring comfortable workout clothes and water. We'll provide all necessary equipment.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mt-1 bg-fitness-red/20 p-1 rounded-full mr-3">
                    <div className="bg-fitness-red rounded-full w-2 h-2"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">No Obligation</h4>
                    <p className="text-gray-400">Enjoy your free class with absolutely no pressure to join afterward.</p>
                  </div>
                </li>
              </ul>
              
              <Button className="bg-fitness-red hover:bg-red-700">
                Claim Your Free Class <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
            
            <div className="animate-on-scroll order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-fitness-red/20 rounded-lg"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-fitness-red/20 rounded-lg"></div>
                <img 
                  src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=2070&auto=format&fit=crop" 
                  alt="Group class" 
                  className="rounded-lg w-full h-auto border-8 border-fitness-darkGray relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Types Section */}
      <section className="bg-fitness-black py-20">
        <div className="container-custom">
          <SectionTitle 
            title="Class Types" 
            subtitle="Explore our diverse range of classes designed to challenge and inspire"
            center={true}
            className="animate-on-scroll mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-fitness-darkGray rounded-lg overflow-hidden animate-on-scroll">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?q=80&w=2069&auto=format&fit=crop" 
                  alt="HIIT Class" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">HIIT & Cardio</h3>
                <p className="text-gray-300 mb-5">
                  High-intensity interval training that burns calories, improves cardiovascular health, and boosts metabolism. Our cardio classes include HIIT Blast, Spin, and Zumba.
                </p>
                <Link to="#" className="text-fitness-red hover:underline flex items-center">
                  View HIIT & Cardio Classes
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="bg-fitness-darkGray rounded-lg overflow-hidden animate-on-scroll">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" 
                  alt="Strength Class" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Strength & Conditioning</h3>
                <p className="text-gray-300 mb-5">
                  Build muscle, increase power, and improve overall fitness with our strength-focused classes. Options include Strength & Conditioning, CrossFit WOD, and Body Pump.
                </p>
                <Link to="#" className="text-fitness-red hover:underline flex items-center">
                  View Strength Classes
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="bg-fitness-darkGray rounded-lg overflow-hidden animate-on-scroll">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Yoga Class" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Mind & Body</h3>
                <p className="text-gray-300 mb-5">
                  Improve flexibility, balance, and mental wellbeing with our mind-body classes. Choose from Yoga Flow, Pilates, and Meditation for a holistic approach to fitness.
                </p>
                <Link to="#" className="text-fitness-red hover:underline flex items-center">
                  View Mind & Body Classes
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2070&auto=format&fit=crop" 
            alt="Class Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              READY TO <span className="text-fitness-red">BOOK</span> YOUR FIRST CLASS?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community and experience the energy and motivation of our group fitness classes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="bg-fitness-red hover:bg-red-700 text-white font-bold text-lg py-6 px-8">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg py-6 px-8">
                      Contact Us
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default SchedulePage;
