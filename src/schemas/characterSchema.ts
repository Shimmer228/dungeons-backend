import { z } from "zod";

export const CharacterSchema = z.object({
        name: z.string(),
        race: z.string(),
        class: z.string(),
        level: z.number(),
        hp: z.number(),
});

export const UpdateCharacterSchema =
    CharacterSchema.partial();