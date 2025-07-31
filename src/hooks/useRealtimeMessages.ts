import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';

export const useRealtimeMessages = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthState();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    // Listen for new messages
    const messagesChannel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          
          // Show notification if message is not from current user
          if (payload.new.sender_id !== user.id) {
            addNotification({
              type: 'message',
              title: 'New Message',
              message: 'You have a new message',
              link: '/dashboard/chat'
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Message updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    // Listen for conversation updates
    const conversationsChannel = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    // Listen for booking notifications
    const bookingsChannel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('New booking:', payload);
          addNotification({
            type: 'booking',
            title: 'Class Booked!',
            message: 'Your class has been successfully booked',
            link: '/dashboard/classes'
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, [user?.id, queryClient]);
};