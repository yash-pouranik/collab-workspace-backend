import { Router } from 'express';
import { create, list, update, invite, updateRole, getOne, remove } from './project.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

import validate from '../../middleware/validate.js';
import { cache } from '../../middleware/cache.middleware.js';
import { createProjectSchema, updateProjectSchema, inviteMemberSchema, updateMemberRoleSchema } from './project.validation.js';

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', validate(createProjectSchema), create);

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: List all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', cache(60), list); // Cache for 60 seconds

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 */
router.patch('/:id', validate(updateProjectSchema), update);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *         description: Project deleted
 */
router.delete('/:id', remove);

/**
 * @swagger
 * /api/v1/projects/{id}/invite:
 *   post:
 *     summary: Invite a member to project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [viewer, collaborator]
 *     responses:
 *       200:
 *         description: Invitation sent
 */
router.post('/:id/invite', validate(inviteMemberSchema), invite);

/**
 * @swagger
 * /api/v1/projects/{id}/role:
 *   patch:
 *     summary: Update member role
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, role]
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [viewer, collaborator]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/:id/role', validate(updateMemberRoleSchema), updateRole);

export default router;
