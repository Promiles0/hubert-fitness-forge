
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, X, AlertCircle } from "lucide-react";
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
      case 'Beginner': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    }
  };

  const BookingCard = ({ booking, showCancel = false }: { booking: Booking; showCancel?: boolean }) => (
    <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{booking.className}</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">with {booking.trainer}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getLevelColor(booking.level)}>
              {booking.level}
            </Badge>
            {booking.status === 'cancelled' && (
              <Badge variant="destructive">Cancelled</Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-fitness-red" />
              <span className="text-gray-900 dark:text-white">{booking.dateFormatted}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-fitness-red" />
              <span className="text-gray-900 dark:text-white">{booking.time} ({booking.duration})</span>
            </div>
          </div>
          <div className="space-y-2">
            {booking.room && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-fitness-red" />
                <span className="text-gray-900 dark:text-white">{booking.room}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-fitness-red" />
              <span className="text-gray-900 dark:text-white">{booking.category}</span>
            </div>
          </div>
        </div>
        
        {showCancel && booking.status === 'confirmed' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => handleCancelClass(booking)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Class
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-fitness-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Classes</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your booked fitness classes</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-white dark:bg-fitness-darkGray border border-gray-200 dark:border-gray-800">
          <TabsTrigger value="upcoming" className="text-gray-900 dark:text-white data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="text-gray-900 dark:text-white data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            Past Classes ({pastBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-gray-900 dark:text-white data-[state=active]:bg-fitness-red data-[state=active]:text-white">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showCancel={true} />
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">No upcoming classes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Book a class to start your fitness journey</p>
                <Button 
                  className="bg-fitness-red hover:bg-red-700"
                  onClick={() => window.location.href = '/schedule'}
                >
                  Browse Classes
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length > 0 ? (
            <div className="grid gap-4">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">No past classes</h3>
                <p className="text-gray-600 dark:text-gray-400">Your completed classes will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length > 0 ? (
            <div className="grid gap-4">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
              <CardContent className="p-8 text-center">
                <X className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">No cancelled classes</h3>
                <p className="text-gray-600 dark:text-gray-400">Cancelled classes will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Cancel Class</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel "{selectedBooking?.className}" scheduled for {selectedBooking?.dateFormatted} at {selectedBooking?.time}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              Keep Class
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelClass}
              className="bg-red-600 hover:bg-red-700 text-white"
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
