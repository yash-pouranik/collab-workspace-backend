import { jest } from '@jest/globals';

// 1. Define mocks BEFORE importing the module under test
jest.unstable_mockModule('../../config/db.js', () => ({
    pool: { query: jest.fn() },
}));

jest.unstable_mockModule('bcrypt', () => ({
    default: {
        hash: jest.fn().mockResolvedValue('hashed_password'),
        compare: jest.fn().mockResolvedValue(true),
    },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn().mockReturnValue('mock_token'),
        verify: jest.fn().mockReturnValue({ id: 'user_123' }),
    },
}));

// 2. Dynamic imports
const { pool } = await import('../../config/db.js');
const bcrypt = await import('bcrypt');
const jwt = await import('jsonwebtoken');

// 3. Added refreshAccessToken to import
const { createUser, authenticateUser, refreshAccessToken } = await import('./auth.service.js');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });
            const user = await createUser({ email: 'test@example.com', password: 'password' });
            expect(user).toHaveProperty('id');
            expect(user.email).toBe('test@example.com');
            expect(pool.query).toHaveBeenCalled();
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user and return tokens', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 'user_123', email: 'test@example.com', password: 'hashed_password', role: 'owner' }],
            });
            pool.query.mockResolvedValueOnce({}); // For refresh token insert
            const result = await authenticateUser({ email: 'test@example.com', password: 'password' });
            expect(result).toHaveProperty('accessToken', 'mock_token');
            expect(result).toHaveProperty('refreshToken', 'mock_token');
        });
    });

    describe('refreshAccessToken', () => {
        it('should return a new access token for a valid refresh token', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ expires_at: new Date(Date.now() + 100000) }] });
            pool.query.mockResolvedValueOnce({ rows: [{ role: 'owner' }] });
            const result = await refreshAccessToken('valid_token');
            expect(result).toHaveProperty('accessToken', 'mock_token');
        });

        it('should throw error if token is expired', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ expires_at: new Date(Date.now() - 100000) }] });
            await expect(refreshAccessToken('expired_token')).rejects.toThrow('Refresh token expired');
        });
    });
});