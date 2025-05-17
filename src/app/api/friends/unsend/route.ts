import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await auth();
  const { receiverId } = await req.json();

  if (!session?.user?.id || !receiverId) {
    return new NextResponse("Unauthorized or bad request", { status: 400 });
  }

  const currentUserId = session.user.id;

  const request = await db.friendRequest.findFirst({
    where: {
      senderId: currentUserId,
      receiverId: receiverId,
    },
  });

  if (!request) {
    return new NextResponse("No friend request found", { status: 404 });
  }

  await db.friendRequest.delete({
    where: { id: request.id },
  });

  await pusherServer.trigger(currentUserId, 'friend:unsend',  {
    receiverId: request.receiverId,
  });

  return new NextResponse("Friend request unsent", { status: 200 });
}
