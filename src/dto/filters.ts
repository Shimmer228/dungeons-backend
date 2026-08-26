import {CharacterFiltersSchema} from "./characterFiltersSchema.js";
import {z} from "zod";

export type CharacterFilters =
    z.infer<typeof CharacterFiltersSchema>;