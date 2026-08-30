import { z } from "zod";
import {CharacterFiltersSchema}from "./characterFiltersSchema.js"

export const CharacterCreationSchema = CharacterFiltersSchema
    .omit({
    sort:true,
})
.extend({
    name: z.string(),
    hp: z.number(),
}).required();