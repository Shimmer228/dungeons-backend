import { z } from "zod";
import {CharacterFiltersSchema}from "./characterFiltersSchema.js"

export const CharacterCreationSchema = CharacterFiltersSchema
    .omit({
    sort:true,
})
.extend({
    id: z.string(),
    name: z.string(),
    hp: z.number(),
    maxHp:z.number(),
}).required();