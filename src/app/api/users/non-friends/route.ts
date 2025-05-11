import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
  const session = await auth();

  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const friends = await db.friend.findMany({
    where: {
      OR: [
        { userId },
        { friendId: userId }
      ]
    },
  });

  const friendIds = friends.map(f =>
    f.userId === userId ? f.friendId : f.userId
  );

  const users = await db.user.findMany({
    where: {
      NOT: {
        id: { in: [...friendIds, userId] },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users(non-friends):", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
