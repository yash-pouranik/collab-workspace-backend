import { Router } from 'express';
import { handler as thumbnailHandler } from '../../../serverless/thumbnail-generator.js';
import { checkFeature } from '../../middleware/featureFlag.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Functions
 *   description: Serverless function triggers
 */

// Trigger Thumbnail Generator
// Protected by 'BETA_FEATURE' flag
/**
 * @swagger
 * /api/v1/functions/thumbnail:
 *   post:
 *     summary: Generate thumbnail (serverless simulation)
 *     tags: [Functions]
 *     description: Protected by BETA_FEATURE flag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [imageId]
 *             properties:
 *               imageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thumbnail generated
 *       403:
 *         description: Feature disabled
 */
router.post('/thumbnail',
    checkFeature('BETA_FEATURE'),
    async (req, res) => {
        try {
            // Adapt Express req to Lambda-like event
            const event = {
                imageId: req.body.imageId,
                headers: req.headers
            };

            const result = await thumbnailHandler(event, {});

            res.status(result.statusCode).json(JSON.parse(result.body));
        } catch (err) {
            res.status(500).json({ message: 'Function execution failed' });
        }
    }
);

export default router;
