import { codeExecutionQueue } from './jobs.queue.js';
import { pool } from '../../config/db.js';

// SUBMIT NEW JOB
export async function submitJob(req, res) {
    try {
        const { language, code } = req.body;

        if (!language || !code) {
            return res.status(400).json({ message: 'Language and code are required' });
        }

        const job = await codeExecutionQueue.add('execute-code', {
            language,
            code
        });

        res.status(202).json({
            jobId: job.id,
            message: 'Job submitted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET JOB STATUS
export async function getJobStatus(req, res) {
    try {
        // 1. Check Queue first
        const job = await codeExecutionQueue.getJob(req.params.id);

        if (job) {
            const state = await job.getState();
            const result = job.returnvalue;
            return res.json({ id: job.id, state, result });
        }

        // 2. Check Database (for completed/old jobs)
        const { rows } = await pool.query(
            'SELECT * FROM job_results WHERE job_id=$1',
            [req.params.id]
        );

        if (rows[0]) {
            return res.json({
                id: rows[0].job_id,
                state: rows[0].status,
                result: { output: rows[0].output }
            });
        }

        return res.status(404).json({ message: 'Job not found' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
