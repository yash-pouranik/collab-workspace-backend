import { Router } from 'express';
import { create, list, update } from './project.controller.js';
import { requireAuth } from '../auth/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', create);
router.get('/', list);
router.patch('/:id', update);

export default router;
