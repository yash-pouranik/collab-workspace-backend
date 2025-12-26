import { Router } from 'express';
import { create, list, update, invite, updateRole, getOne } from './project.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', create);
router.get('/', list);
router.patch('/:id', update);
router.post('/:id/invite', invite);
router.patch('/:id/role', updateRole);

export default router;
