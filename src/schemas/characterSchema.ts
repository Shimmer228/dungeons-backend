import { z } from 'zod';
export const UpdateCharacterSchema = z.object({
        name: z.string().optional(),
        race: z.string().optional(),
        class: z.string().optional(),
        level: z.number().optional(),
        hp: z.number().optional(),
    });