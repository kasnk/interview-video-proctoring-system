import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import sessionRoutes from './routes/sessionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

connectDB(); // Connect to MongoDB Atlas

app.use(cors());
app.use(express.json());

// Serve PDF reports statically
app.use('/reports', express.static('reports'));

app.use('/api/session', sessionRoutes);
app.use('/api/report', reportRoutes);

io.on('connection', socket => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('join-session', ({ sessionId, role }) => {
    console.log(`[Socket] ${role} joining session: ${sessionId}`);
    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.role = role;
  });

  socket.on('offer', ({ offer, sessionId }) => {
    console.log(`[Socket] Offer received for session: ${sessionId}`);
    socket.to(sessionId).emit('offer', { offer, sessionId });
  });

  socket.on('answer', ({ answer, sessionId }) => {
    console.log(`[Socket] Answer received for session: ${sessionId}`);
    socket.to(sessionId).emit('answer', { answer, sessionId });
  });

  socket.on('ice-candidate', ({ candidate, sessionId }) => {
    console.log(`[Socket] ICE candidate for session: ${sessionId}`);
    socket.to(sessionId).emit('ice-candidate', { candidate, sessionId });
  });

  socket.on('session-ended', sessionId => {
    console.log(`[Socket] Session ended: ${sessionId}`);
    io.to(sessionId).emit('session-ended', sessionId);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on 0.0.0.0:${PORT}`));
