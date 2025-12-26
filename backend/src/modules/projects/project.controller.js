import {
    createProject,
    getProjectsByUser,
    updateProject
} from './project.service.js';

export function create(req, res) {
    const project = createProject({
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
