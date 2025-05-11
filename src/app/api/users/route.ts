import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const users = await db.user.findMany({

      where: {
        id: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
