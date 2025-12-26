import { Router } from 'express';
import { submitJob, getJobStatus } from './jobs.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

// ROUTES DEFINITION
router.post('/', requireAuth, submitJob);
router.get('/:id', requireAuth, getJobStatus);

export default router;
