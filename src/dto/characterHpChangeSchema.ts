import { z } from "zod";
export const HpChangeSchema = z.object({
    amount: z.number(),
});