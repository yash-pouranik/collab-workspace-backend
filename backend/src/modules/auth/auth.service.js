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

    return jwt.sign(
        { id: rows[0].id, role: rows[0].role },
        env.jwtSecret,
        { expiresIn: '1h' }
    );
}
