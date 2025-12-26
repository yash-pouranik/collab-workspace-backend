import { codeExecutionQueue } from './jobs.queue.js';

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
        const job = await codeExecutionQueue.getJob(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const state = await job.getState();
        const result = job.returnvalue;

        res.json({
            id: job.id,
            state,
            result
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
