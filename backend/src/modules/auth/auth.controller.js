import { createUser, authenticateUser } from './auth.service.js';

export async function register(req, res) {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export async function login(req, res) {
    try {
        const token = await authenticateUser(req.body);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

export async function me(req, res) {
    res.json({ user: req.user });
}
