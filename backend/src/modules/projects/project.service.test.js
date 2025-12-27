import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/db.js', () => ({
    pool: { query: jest.fn() },
}));

const { pool } = await import('../../config/db.js');
const { 
    createProject, 
    updateProject, 
    deleteProject, 
    getProjectById, 
    inviteMember,
    updateMemberRole 
} = await import('./project.service.js');

describe('Project Service', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should update project name if user is owner', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ role: 'owner' }] }); // Auth check
        pool.query.mockResolvedValueOnce({ rows: [] }); // Update query
        const res = await updateProject({ projectId: 'p1', name: 'New Name', userId: 'u1' });
        expect(res.name).toBe('New Name');
    });

    it('should throw error if non-owner tries to update', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ role: 'viewer' }] });
        await expect(updateProject({ projectId: 'p1', name: 'X', userId: 'u2' }))
            .rejects.toThrow('Not authorized');
    });

    it('should invite a member if inviter is owner', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ role: 'owner' }] }); // Owner check
        pool.query.mockResolvedValueOnce({ rows: [{ id: 'target_u' }] }); // Target user check
        pool.query.mockResolvedValueOnce({ rows: [] }); // Insert check
        const res = await inviteMember({ projectId: 'p1', ownerId: 'o1', email: 't@t.com', role: 'collaborator' });
        expect(res.message).toBe('User invited');
    });

    it('should get project by ID with access check', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 'p1', name: 'Test' }] });
        const res = await getProjectById({ projectId: 'p1', userId: 'u1' });
        expect(res.id).toBe('p1');
    });

    it('should update member role', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ role: 'owner' }] }); // Owner check
        pool.query.mockResolvedValueOnce({ rows: [] }); // Update query
        const res = await updateMemberRole({ projectId: 'p1', ownerId: 'o1', userId: 'u2', role: 'viewer' });
        expect(res.message).toBe('Role updated');
    });
});