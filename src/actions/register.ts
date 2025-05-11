"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/actions/getUserInfo";
import { signUpSchema } from "@/lib/zod";
import { hashPassword } from "@/utils/hashPassword";
import { ZodError } from "zod";

export const register = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    signUpSchema.parse({ email, password });

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "Email already in use!" };
    }

    if (!email || !password || !name) {
      return { error: "All fields are required." };
    }

    const hashedPassword = hashPassword(password);

    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return { success: "User registered successfully!" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: "Something went wrong." };
  }
};
