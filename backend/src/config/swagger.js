import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';

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
    apis: ['./src/modules/**/*.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
