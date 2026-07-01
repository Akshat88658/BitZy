import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Socket.io connected to server:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket.io disconnected from server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // When a user logs in, register their user ID to receive direct notifications
  useEffect(() => {
    if (socket && connected && user) {
      socket.emit('register', user._id);
      console.log(`Registered user ${user.username} (${user._id}) on socket connection`);
    }
  }, [socket, connected, user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
