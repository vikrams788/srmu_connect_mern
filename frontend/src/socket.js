import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_REACT_APP_API_URL);

socket.on('connect', () => {
  console.log('Connected to Socket.io server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.io server');
});