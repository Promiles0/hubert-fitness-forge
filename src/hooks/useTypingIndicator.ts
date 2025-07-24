import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';

interface TypingUser {
  user_id: string;
  name: string;
  timestamp: number;
}

export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuthState();

  const channel = supabase.channel(`typing-${conversationId}`);

  // Send typing indicator
  const sendTypingIndicator = useCallback((typing: boolean) => {
    if (!user?.id || !conversationId) return;

    setIsTyping(typing);
    
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        name: user.email?.split('@')[0] || 'User',
        typing,
        timestamp: Date.now()
      }
    });
  }, [user?.id, conversationId, channel]);

  useEffect(() => {
    if (!conversationId) return;

    // Subscribe to typing events
    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user_id, name, typing, timestamp } = payload.payload;
        
        // Don't show own typing indicator
        if (user_id === user?.id) return;

        setTypingUsers(prev => {
          if (typing) {
            // Add or update typing user
            const existing = prev.find(u => u.user_id === user_id);
            if (existing) {
              return prev.map(u => 
                u.user_id === user_id 
                  ? { ...u, timestamp }
                  : u
              );
            }
            return [...prev, { user_id, name, timestamp }];
          } else {
            // Remove typing user
            return prev.filter(u => u.user_id !== user_id);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id]);

  // Clean up old typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => 
        prev.filter(user => now - user.timestamp < 3000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    typingUsers: typingUsers.filter(u => u.user_id !== user?.id),
    sendTypingIndicator,
    isTyping
  };
};