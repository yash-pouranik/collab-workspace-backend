import { redis } from '../config/redis.js';

export const cache = (durationInSeconds) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedBody = await redis.get(key);
            if (cachedBody) {
                return res.json(JSON.parse(cachedBody));
            }

            // Intercept res.json to cache response
            const originalJson = res.json;
            res.json = (body) => {
                redis.setex(key, durationInSeconds, JSON.stringify(body))
                    .catch(err => console.error('Cache Error:', err));
                return originalJson.call(res, body);
            };

            next();
        } catch (err) {
            console.error('Cache Middleware Error:', err);
            next();
        }
    };
};
