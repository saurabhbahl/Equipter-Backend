import { z } from "zod";

export const userRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "user"]).default("user"),
});
export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const userForgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const userResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
