import { jest } from '@jest/globals';

// 1. Define mocks BEFORE importing the module under test
jest.unstable_mockModule('../../config/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
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

// 3. Import module under test AFTER mocks
const { createUser, authenticateUser } = await import('./auth.service.js');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            // Mock db response for INSERT (usually returns empty rows or result)
            pool.query.mockResolvedValueOnce({ rows: [] });

            const user = await createUser({ email: 'test@example.com', password: 'password' });

            expect(user).toHaveProperty('id');
            expect(user.email).toBe('test@example.com');
            // Verify pool.query was called with correct SQL
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                expect.anything()
            );
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user and return tokens', async () => {
            // Mock SELECT user query
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 'user_123', email: 'test@example.com', password: 'hashed_password', role: 'owner' }],
            });
            // Mock INSERT refresh token query
            pool.query.mockResolvedValueOnce({});

            const result = await authenticateUser({ email: 'test@example.com', password: 'password' });

            expect(result).toHaveProperty('accessToken', 'mock_token');
            expect(result).toHaveProperty('refreshToken', 'mock_token');
            expect(bcrypt.default.compare).toHaveBeenCalledWith('password', 'hashed_password');
        });
    });
});
