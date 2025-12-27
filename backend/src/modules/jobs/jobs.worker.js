import { Worker } from 'bullmq';
import { redis } from '../../config/redis.js';
import { pool } from '../../config/db.js';

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
worker.on('completed', async (job) => {
    console.log(`Job ${job.id} completed`);
    try {
        await pool.query(
            'INSERT INTO job_results (job_id, status, output) VALUES ($1, $2, $3)',
            [job.id, 'success', job.returnvalue.output]
        );
    } catch (err) {
        console.error('Failed to save job result:', err);
    }
});

worker.on('failed', async (job, err) => {
    console.log(`Job ${job.id} failed: ${err.message}`);
    try {
        await pool.query(
            'INSERT INTO job_results (job_id, status, output) VALUES ($1, $2, $3)',
            [job.id, 'failed', err.message]
        );
    } catch (dbErr) {
        console.error('Failed to save job failure:', dbErr);
    }
});
