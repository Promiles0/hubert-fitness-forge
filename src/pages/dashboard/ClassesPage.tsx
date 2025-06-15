
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, X, AlertCircle, Sparkles, Zap, Heart, Target } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Booking {
  id: string;
  classId: string;
  className: string;
  trainer: string;
  time: string;
  date: string;
  dateFormatted: string;
  duration: string;
  level: string;
  category: string;
  room?: string;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}

const ClassesPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    try {
      const storedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      setBookings(storedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error("Failed to load your classes");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClass = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancelClass = () => {
    if (!selectedBooking) return;

    try {
      const storedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const updatedBookings = storedBookings.map((booking: Booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
      
      toast.success(`Successfully cancelled ${selectedBooking.className}`);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling class:', error);
      toast.error("Failed to cancel class");
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(`${booking.date} ${booking.time}`) > new Date()
  );

  const pastBookings = bookings.filter(booking => 
    new Date(`${booking.date} ${booking.time}`) <= new Date()
  );

  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500/20 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/20 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'yoga': return Heart;
      case 'hiit': case 'cardio': return Zap;
      case 'strength': return Target;
      default: return Sparkles;
    }
  };

  const BookingCard = ({ booking, showCancel = false }: { booking: Booking; showCancel?: boolean }) => {
    const IconComponent = getCategoryIcon(booking.category);
    
    return (
      <Card className="group relative overflow-hidden bg-gradient-to-br from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:border-fitness-red/30 dark:hover:border-fitness-red/40 transition-all duration-700 hover:shadow-2xl hover:shadow-fitness-red/10 dark:hover:shadow-fitness-red/20 hover:-translate-y-2 hover:scale-[1.02]">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-fitness-red/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-60 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
          <IconComponent className="h-12 w-12 text-fitness-red" />
        </div>
        
        <CardContent className="relative z-10 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-fitness-red/10 dark:bg-fitness-red/20 group-hover:bg-fitness-red/20 dark:group-hover:bg-fitness-red/30 transition-colors duration-500">
                  <IconComponent className="h-5 w-5 text-fitness-red" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-fitness-red transition-colors duration-300">
                    {booking.className}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm truncate">with <span className="font-medium">{booking.trainer}</span></p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${getLevelColor(booking.level)} text-xs font-semibold px-3 py-1.5 border transition-all duration-300 group-hover:scale-105`}>
                {booking.level}
              </Badge>
              {booking.status === 'cancelled' && (
                <Badge variant="destructive" className="text-xs font-semibold px-3 py-1.5 animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Cancelled
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-fitness-red/10 to-red-500/20 dark:from-fitness-red/20 dark:to-red-500/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-4 w-4 text-fitness-red" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">{booking.dateFormatted}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Session Date</span>
                </div>
              </div>
              <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/20 dark:from-blue-500/20 dark:to-blue-600/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">{booking.time}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{booking.duration} session</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {booking.room && (
                <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-600/20 dark:from-purple-500/20 dark:to-purple-600/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">{booking.room}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Studio Location</span>
                  </div>
                </div>
              )}
              <div className="flex items-center text-sm group-hover:text-fitness-red transition-colors duration-300">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 dark:from-emerald-500/20 dark:to-emerald-600/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">{booking.category}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Class Type</span>
                </div>
              </div>
            </div>
          </div>
          
          {showCancel && booking.status === 'confirmed' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 min-h-[48px] font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group-hover:animate-pulse"
              onClick={() => handleCancelClass(booking)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Class
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-fitness-red/20 border-t-fitness-red"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-fitness-red/40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-fitness-red/10 to-red-500/20 dark:from-fitness-red/20 dark:to-red-500/30">
            <Sparkles className="h-8 w-8 text-fitness-red" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-fitness-red to-gray-900 dark:from-white dark:via-fitness-red dark:to-white bg-clip-text text-transparent">
              My Classes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">Manage your booked fitness classes</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 w-full sm:w-auto rounded-2xl p-1.5 shadow-xl">
          <TabsTrigger 
            value="upcoming" 
            className="text-gray-900 dark:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-fitness-red data-[state=active]:to-red-600 data-[state=active]:text-white flex-1 sm:flex-none text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            className="text-gray-900 dark:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-fitness-red data-[state=active]:to-red-600 data-[state=active]:text-white flex-1 sm:flex-none text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Past ({pastBookings.length})
          </TabsTrigger>
          <TabsTrigger 
            value="cancelled" 
            className="text-gray-900 dark:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-fitness-red data-[state=active]:to-red-600 data-[state=active]:text-white flex-1 sm:flex-none text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-6">
              {upcomingBookings.map((booking, index) => (
                <div key={booking.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <BookingCard booking={booking} showCancel={true} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 animate-ping">
                    <Calendar className="h-16 w-16 text-fitness-red/30 mx-auto" />
                  </div>
                  <Calendar className="h-16 w-16 text-fitness-red mx-auto relative z-10" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3">No upcoming classes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">Book a class to start your fitness journey</p>
                <Button 
                  className="bg-gradient-to-r from-fitness-red to-red-600 hover:from-red-600 hover:to-red-700 min-h-[48px] font-semibold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.href = '/schedule'}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Browse Classes
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastBookings.length > 0 ? (
            <div className="grid gap-6">
              {pastBookings.map((booking, index) => (
                <div key={booking.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <BookingCard booking={booking} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl">
              <CardContent className="p-8 sm:p-12 text-center">
                <Clock className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-6 animate-pulse" />
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3">No past classes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Your completed classes will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {cancelledBookings.length > 0 ? (
            <div className="grid gap-6">
              {cancelledBookings.map((booking, index) => (
                <div key={booking.id} className="animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <BookingCard booking={booking} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-2xl">
              <CardContent className="p-8 sm:p-12 text-center">
                <X className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-6 animate-pulse" />
                <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3">No cancelled classes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Cancelled classes will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 mx-4 sm:mx-auto max-w-md sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white text-lg sm:text-xl">Cancel Class</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Are you sure you want to cancel "{selectedBooking?.className}" scheduled for {selectedBooking?.dateFormatted} at {selectedBooking?.time}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full sm:w-auto min-h-[44px]">
              Keep Class
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelClass}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto min-h-[44px]"
            >
              Cancel Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassesPage;
