import { z } from "zod";

export const userRegisterSchema = z.object({
  username: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be string",
    })
    .trim()
    .min(10, { message: "Name must be at least 10 character long" })
    .max(30, { message: "Name must be at max 20 character long" }),

  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
  confirmPassword: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
  email: z.string().email({ message: "Please enter valid email id" }),
});

export const userLoginSchema = z.object({
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
  email: z.string().email({ message: "Please enter valid email id" }),
});
