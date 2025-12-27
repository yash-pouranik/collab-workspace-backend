import { z } from 'zod';

export const submitJobSchema = z.object({
    body: z.object({
        language: z.enum(['javascript', 'python', 'cpp']), // Add other supported languages if any
        code: z.string().min(1),
    }),
});
