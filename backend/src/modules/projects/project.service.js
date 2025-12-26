const projects = [];

export function createProject({ name, ownerId }) {
    const project = {
        id: `proj_${projects.length + 1}`,
        name,
        ownerId,
        members: [
            { userId: ownerId, role: 'owner' }
        ],
        createdAt: new Date()
    };

    projects.push(project);
    return project;
}

export function getProjectsByUser(userId) {
    return projects.filter(p =>
        p.members.some(m => m.userId === userId)
    );
}

export function updateProject({ projectId, name, userId }) {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const member = project.members.find(m => m.userId === userId);
    if (!member || member.role !== 'owner') {
        throw new Error('Not authorized');
    }

    project.name = name;
    return project;
}
