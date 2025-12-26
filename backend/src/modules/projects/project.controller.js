import {
    createProject,
    getProjectsByUser,
    updateProject,
    inviteMember,
    updateMemberRole,
    getProjectById
} from './project.service.js';

export async function create(req, res) {
    const project = await createProject({
        name: req.body.name,
        ownerId: req.user.id
    });
    res.status(201).json(project);
}


export function list(req, res) {
    const projects = getProjectsByUser(req.user.id);
    res.json(projects);
}

export function update(req, res) {
    try {
        const project = updateProject({
            projectId: req.params.id,
            name: req.body.name,
            userId: req.user.id
        });
        res.json(project);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

export async function getOne(req, res) {
    try {
        const project = await getProjectById({
            projectId: req.params.id,
            userId: req.user.id
        });
        res.json(project);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export async function invite(req, res) {
    try {
        const result = await inviteMember({
            projectId: req.params.id,
            ownerId: req.user.id,
            email: req.body.email,
            role: req.body.role || 'collaborator'
        });
        res.json(result);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

export async function updateRole(req, res) {
    try {
        const result = await updateMemberRole({
            projectId: req.params.id,
            ownerId: req.user.id,
            userId: req.body.userId,
            role: req.body.role
        });
        res.json(result);
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}
