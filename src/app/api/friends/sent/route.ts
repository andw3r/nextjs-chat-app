import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const sentRequests = await db.friendRequest.findMany({
    where: { senderId: userId },
    select: {
      receiverId: true,
      senderId: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(sentRequests);
}
