import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    redisUrl: process.env.REDIS_URL,
};
