import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/projects/project.routes.js';
import jobRoutes from './modules/jobs/jobs.routes.js';


const app = express();

// SECURITY MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(express.json());

// RATE LIMITING
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 MINUTES
    max: 100 // LIMIT EACH IP TO 100 REQUESTS PER WINDOWMS
});
app.use(limiter);

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
app.use('/projects', projectRoutes);
app.use('/jobs', jobRoutes);


export default app;
