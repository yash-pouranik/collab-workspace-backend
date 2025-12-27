import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { pool } from '../../config/db.js';

export async function createUser({ email, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const id = `user_${Date.now()}`;

    await pool.query(
        'INSERT INTO users (id, email, password, role) VALUES ($1,$2,$3,$4)',
        [id, email, hashed, 'owner']
    );

    return { id, email, role: 'owner' };
}

export async function authenticateUser({ email, password }) {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE email=$1',
        [email]
    );
    if (!rows[0]) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(password, rows[0].password);
    if (!ok) throw new Error('Invalid credentials');

    const accessToken = jwt.sign(
        { id: rows[0].id, role: rows[0].role },
        env.jwtSecret,
        { expiresIn: '15m' } // Short lived access token
    );

    const refreshToken = jwt.sign(
        { id: rows[0].id },
        env.jwtSecret,
        { expiresIn: '7d' }
    );

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await pool.query(
        'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)',
        [refreshToken, rows[0].id, expiresAt]
    );

    return { accessToken, refreshToken, user: { id: rows[0].id, email, role: rows[0].role } };
}

export async function refreshAccessToken(token) {
    if (!token) throw new Error('Refresh token required');

    // Check DB
    const { rows } = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token=$1',
        [token]
    );
    if (!rows[0]) throw new Error('Invalid refresh token');

    // Verify JWT
    let decoded;
    try {
        decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }

    // Check expiry in DB (double check)
    if (new Date() > new Date(rows[0].expires_at)) {
        await pool.query('DELETE FROM refresh_tokens WHERE token=$1', [token]);
        throw new Error('Refresh token expired');
    }

    // Get user role
    const userRes = await pool.query('SELECT role FROM users WHERE id=$1', [decoded.id]);
    if (!userRes.rows[0]) throw new Error('User not found');

    // Issue new access token
    const accessToken = jwt.sign(
        { id: decoded.id, role: userRes.rows[0].role },
        env.jwtSecret,
        { expiresIn: '15m' }
    );

    return { accessToken };
}
