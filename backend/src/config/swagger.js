import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Collab Workspace API',
            version: '1.0.0',
            description: 'API documentation for Real-Time Collaborative Workspace Backend',
        },
        servers: [
            {
                url: `http://localhost:${env.port}`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../modules/**/*.js')], // Absolute path to the API docs
};

export const specs = swaggerJsdoc(options);
