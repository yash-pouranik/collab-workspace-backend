import { jest } from '@jest/globals';

// 1. Mock Dependencies
jest.unstable_mockModule('./jobs.queue.js', () => ({
    codeExecutionQueue: {
        add: jest.fn(),
        getJob: jest.fn()
    },
}));
jest.unstable_mockModule('../../config/db.js', () => ({
    pool: { query: jest.fn() }
}));

const { codeExecutionQueue } = await import('./jobs.queue.js');
const { pool } = await import('../../config/db.js');
const { submitJob, getJobStatus } = await import('./jobs.controller.js');

describe('Jobs Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    describe('submitJob', () => {
        it('should submit job successfully', async () => {
            req = { body: { language: 'javascript', code: 'console.log(1)' } };
            codeExecutionQueue.add.mockResolvedValueOnce({ id: 'job_1' });
            await submitJob(req, res);
            expect(res.status).toHaveBeenCalledWith(202);
        });

        it('should return 400 if language or code is missing', async () => {
            req = { body: {} };
            await submitJob(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getJobStatus', () => {
        it('should get status from queue if job exists', async () => {
            req = { params: { id: 'job_1' } };
            codeExecutionQueue.getJob.mockResolvedValueOnce({
                id: 'job_1',
                getState: jest.fn().mockResolvedValue('completed'),
                returnvalue: { output: 'success' }
            });
            await getJobStatus(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ state: 'completed' }));
        });

        it('should fallback to database if job not in queue', async () => {
            req = { params: { id: 'job_db' } };
            codeExecutionQueue.getJob.mockResolvedValueOnce(null);
            pool.query.mockResolvedValueOnce({ rows: [{ job_id: 'job_db', status: 'success', output: 'hi' }] });
            await getJobStatus(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'job_db' }));
        });

        it('should return 404 if job not found anywhere', async () => {
            req = { params: { id: 'missing' } };
            codeExecutionQueue.getJob.mockResolvedValueOnce(null);
            pool.query.mockResolvedValueOnce({ rows: [] });
            await getJobStatus(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});