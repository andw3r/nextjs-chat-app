import { db } from "@/lib/db";
import { getUserByEmail } from "@/actions/getUserInfo";
import { signUpSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
  try {
    const body = await request.json();
    const { email, password, name } = body;

    signUpSchema.parse(body);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use!" }, { status: 400 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
