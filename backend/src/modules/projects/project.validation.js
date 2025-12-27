import { z } from 'zod';

export const createProjectSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
    }),
});

export const updateProjectSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const inviteMemberSchema = z.object({
    body: z.object({
        email: z.string().email(),
        role: z.enum(['viewer', 'collaborator']),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const updateMemberRoleSchema = z.object({
    body: z.object({
        userId: z.string().uuid(),
        role: z.enum(['viewer', 'collaborator']),
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});
