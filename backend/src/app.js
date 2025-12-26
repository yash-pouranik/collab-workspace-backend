import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
import { requireAuth } from './modules/auth/auth.middleware.js';
import { requireRole } from './utils/requireRole.js';
import { ROLES } from './utils/roles.js';

app.get(
    '/owner-only',
    requireAuth,
    requireRole([ROLES.OWNER]),
    (req, res) => {
        res.json({ message: 'Welcome, owner!' });
    }
);

app.use('/auth', authRoutes);

export default app;
