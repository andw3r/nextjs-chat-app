import { object, string } from "zod"

export const signUpSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email or password"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .email("Invalid email or password"),
})