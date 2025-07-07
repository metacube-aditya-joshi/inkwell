import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(5, { message: "Minimum 5 charactes is needed!!" })
    .max(50, { message: "Maximum 50 characters can be used" }),
  slug: z
    .string()
    .min(5, { message: "Minimum 5 charactes is needed!!" })
    .max(50, { message: "Maximum 50 characters can be used" }),
  description: z
    .string()
    .min(5, { message: "Minimum 5 charactes is needed!!" })
    .max(50, { message: "Maximum 50 characters can be used" })
    .optional(),
  is_active: z.boolean(),
  parent_id: z.number().optional(),

});
