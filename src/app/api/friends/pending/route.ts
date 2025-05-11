import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const pendingRequests = await db.friendRequest.findMany({
    where: { receiverId: userId },
    select: {
      createdAt: true,
      sender: {
        select: { id: true, name: true, image: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatTedpendingRequests = pendingRequests.map(req => ({
    senderId: req.sender.id,
    senderName: req.sender.name,
    senderImage: req.sender.image,
    sent: req.createdAt,
  }));

  return NextResponse.json(formatTedpendingRequests);
}
