import { z } from "zod";
export const CharacterFiltersSchema = z.object({
    race: z.string().optional(),
    class: z.string().optional(),
    level: z.coerce.number().optional(),
    sort: z.string().optional()
});