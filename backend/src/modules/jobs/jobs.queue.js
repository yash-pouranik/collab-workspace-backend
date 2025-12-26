import { Queue } from 'bullmq';
import { env } from '../../config/env.js';
import { redis } from '../../config/redis.js';

// INITIALIZE JOB QUEUE
export const codeExecutionQueue = new Queue('code-execution', {
    connection: redis
});
