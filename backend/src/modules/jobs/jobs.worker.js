import { Worker } from 'bullmq';
import { redis } from '../../config/redis.js';

// MOCK CODE EXECUTION FUNCTION
async function executeCode(job) {
    const { language, code } = job.data;

    // SIMULATED EXECUTION DELAY
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (code.includes('error')) {
        throw new Error('Runtime Error: Simulated failure');
    }

    return {
        output: `Executed ${language} code successfully`,
        status: 'success'
    };
}

// INITIALIZE WORKER
export const worker = new Worker('code-execution', async (job) => {
    return await executeCode(job);
}, {
    connection: redis
});

// WORKER EVENTS
worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed: ${err.message}`);
});
