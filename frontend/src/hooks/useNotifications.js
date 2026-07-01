import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, connected } = useSocket();
  const { user } = useAuth();

  // Fetch all notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to load notifications:', error.message);
    }
  }, [user]);

  // Load initial notifications on load/auth
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Connect to socket and listen for real-time notification events
  useEffect(() => {
    if (socket && connected && user) {
      const handleNewNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Optionally display browser/toast notification here
        if (Notification.permission === 'granted') {
          new Notification('Bidzy Auction Alert', {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      };

      socket.on('notification_received', handleNewNotification);

      return () => {
        socket.off('notification_received', handleNewNotification);
      };
    }
  }, [socket, connected, user]);

  // Request browser notification permissions on mount if user is logged in
  useEffect(() => {
    if (user && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error.message);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error.message);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};

export default useNotifications;
