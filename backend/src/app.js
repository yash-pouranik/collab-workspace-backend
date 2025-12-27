import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/projects/project.routes.js';
import jobRoutes from './modules/jobs/jobs.routes.js';


import morgan from 'morgan';

const app = express();

// SECURITY MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(morgan('dev')); // HTTP Request Logging
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

import functionRoutes from './modules/functions/functions.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/functions', functionRoutes);

import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


export default app;
