import { pool } from '../../config/db.js';

export async function createProject({ name, ownerId }) {
    const id = `proj_${Date.now()}`;

    await pool.query(
        'INSERT INTO projects (id, name, owner_id) VALUES ($1,$2,$3)',
        [id, name, ownerId]
    );

    await pool.query(
        'INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,$3)',
        [id, ownerId, 'owner']
    );

    return { id, name, ownerId };
}

export async function getProjectsByUser(userId) {
    const { rows } = await pool.query(
        `SELECT p.* FROM projects p
     JOIN project_members m ON m.project_id=p.id
     WHERE m.user_id=$1`,
        [userId]
    );
    return rows;
}

export async function updateProject({ projectId, name, userId }) {
    const { rows } = await pool.query(
        'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
        [projectId, userId]
    );
    if (!rows[0] || rows[0].role !== 'owner') throw new Error('Not authorized');

    await pool.query(
        'UPDATE projects SET name=$1 WHERE id=$2',
        [name, projectId]
    );

    return { id: projectId, name };
}
