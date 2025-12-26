import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { redis } from '../../config/redis.js';

let io;

export function initSocket(server) {
    // INITIALIZE SOCKET SERVER
    io = new Server(server, {
        cors: {
            origin: '*', // ADJUST FOR PRODUCTION
            methods: ['GET', 'POST']
        }
    });

    // AUTHENTICATION MIDDLEWARE
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.token;
        if (!token) return next(new Error('Authentication error'));

        try {
            const decoded = jwt.verify(token, env.jwtSecret);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    // CONNECTION HANDLER
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        // JOIN PROJECT ROOM
        socket.on('join-project', (projectId) => {
            socket.join(projectId);
            console.log(`User ${socket.user.id} joined project ${projectId}`);
            socket.to(projectId).emit('user-joined', { userId: socket.user.id });
        });

        // LEAVE PROJECT ROOM
        socket.on('leave-project', (projectId) => {
            socket.leave(projectId);
            console.log(`User ${socket.user.id} left project ${projectId}`);
            socket.to(projectId).emit('user-left', { userId: socket.user.id });
        });

        // FILE CHANGE EVENT
        socket.on('file-change', ({ projectId, filePath, content }) => {
            // BROADCAST TO OTHERS IN ROOM
            socket.to(projectId).emit('file-change', {
                userId: socket.user.id,
                filePath,
                content
            });
        });

        // CURSOR MOVE EVENT
        socket.on('cursor-move', ({ projectId, filePath, cursor }) => {
            socket.to(projectId).emit('cursor-move', {
                userId: socket.user.id,
                filePath,
                cursor
            });
        });

        // DISCONNECT
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}
