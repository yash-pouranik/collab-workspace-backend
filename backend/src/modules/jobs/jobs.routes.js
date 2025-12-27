import { Router } from 'express';
import { submitJob, getJobStatus } from './jobs.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

import validate from '../../middleware/validate.js';
import { submitJobSchema } from './jobs.validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Async job processing
 */

// ROUTES DEFINITION

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Submit a code execution job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [language, code]
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [javascript, python, cpp]
 *               code:
 *                 type: string
 *     responses:
 *       202:
 *         description: Job submitted successfully
 */
router.post('/', requireAuth, validate(submitJobSchema), submitJob);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get job status and result
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', requireAuth, getJobStatus);

export default router;
