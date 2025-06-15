
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
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
import BookingCard from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/dashboard/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  if (loading) {
    return <LoadingSpinner variant="fitness" />;
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
                  <BookingCard booking={booking} showCancel={true} onCancel={handleCancelClass} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type="upcoming" />
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
            <EmptyState type="past" />
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
            <EmptyState type="cancelled" />
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
