import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const friends = await db.friend.findMany({
      where: { user: { id: session.user.id } },
      select: {
        friend: {
          select: { id: true, name: true, image: true,  }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedFriends = friends.map((entry) => entry.friend);

    return NextResponse.json(formattedFriends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
