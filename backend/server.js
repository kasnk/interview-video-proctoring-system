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
  socket.on('offer', ({ offer, sessionId }) => {
    socket.broadcast.emit('offer', { offer, sessionId });
  });

  socket.on('answer', ({ answer, sessionId }) => {
    socket.broadcast.emit('answer', { answer, sessionId });
  });

  socket.on('ice-candidate', ({ candidate, sessionId }) => {
    socket.broadcast.emit('ice-candidate', { candidate, sessionId });
  });

  socket.on('session-ended', sessionId => {
    io.emit('session-ended', sessionId);
  });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, 'localhost', () => console.log(`Server running on localhost:${PORT}`));
