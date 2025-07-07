import { AnyZodObject,  ZodError } from "zod";

export const validator = <T>(
  schema: AnyZodObject,
  data: T
): { success?: boolean; error?: string } => {
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return {
        error: errorMessage ?? "Invalid request data",
      };
    } else {
      return { success: false, error: "Unexpected error during validation " };
    }
  }
};
