import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

export interface Notification {
  id: string;
  type: 'login' | 'message' | 'settings' | 'job' | 'system' | 'booking';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  simulateMessage: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuthState();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add login notification when user logs in
  useEffect(() => {
    if (user && notifications.length === 0) {
      addNotification({
        type: 'login',
        title: 'Welcome back!',
        message: 'You logged in successfully',
        link: '/dashboard'
      });
    }
  }, [user]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50

    // Show toast for new notifications
    toast.success(notificationData.title, {
      description: notificationData.message,
      duration: 4000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const simulateMessage = () => {
    const sampleMessages = [
      { from: 'Alice Johnson', message: 'Hey! Are you coming to the yoga class?' },
      { from: 'Mike Wilson', message: 'Great workout today! Same time tomorrow?' },
      { from: 'Admin Support', message: 'Your membership renewal is due next week' },
      { from: 'Sarah Davis', message: 'Check out this new workout routine I found!' },
    ];

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    addNotification({
      type: 'message',
      title: 'New Message',
      message: `${randomMessage.from}: ${randomMessage.message}`,
      link: '/dashboard/chat'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      simulateMessage
    }}>
      {children}
    </NotificationContext.Provider>
  );
};