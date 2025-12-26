import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import './config/redis.js';
import { initSocket } from './modules/realtime/socket.js';
import './modules/jobs/jobs.worker.js';

await connectDB();

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
});
