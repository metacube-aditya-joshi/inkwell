import { z } from "zod";

const jsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(jsonSchema),
  ])
);

export const postSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Please Enter the title",
    })
    .min(5, { message: "Title requires at least 10 characters" })
    .max(40, { message: "Title can have atmax 40 characters" }),
  slug: z.string().optional(),
  content: z
    .string()
    .min(10, { message: "Minimum lenght of content is 10 characters" }),
  featured_image_url: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "PUBLISHED", "REJECTED"], {
    required_error: "Post status is required",
    invalid_type_error: "Invalid type of status is chosen",
  }).optional(),
  meta_description: z.string().optional(),
  tags: jsonSchema.optional(),
});
