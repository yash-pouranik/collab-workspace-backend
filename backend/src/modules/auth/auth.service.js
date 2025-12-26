import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

// TEMP in-memory store (DB later)
const users = [];

export async function createUser({ email, password }) {
    const existing = users.find((u) => u.email === email);
    if (existing) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: `user_${users.length + 1}`,
        email,
        password: hashedPassword,
        role: 'owner',
    };

    users.push(user);

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
}

export async function authenticateUser({ email, password }) {
    const user = users.find((u) => u.email === email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        env.jwtSecret,
        { expiresIn: '1h' }
    );

    return token;
}
