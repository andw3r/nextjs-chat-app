import { NextResponse } from "next/server";
import { auth,} from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const session = await auth();
  const { senderId } = await req.json();

  if (!session?.user?.id || !senderId) {
    return new NextResponse("Unauthorized or bad request", { status: 400 });
  }

  const request = await db.friendRequest.findFirst({
    where: {
      senderId,
      receiverId: session.user.id,
    },
  });

  if (!request) {
    return new NextResponse("No friend request found", { status: 404 });
  }

  await db.friend.createMany({
    data: [
      { userId: session.user.id, friendId: senderId },
      { userId: senderId, friendId: session.user.id },
    ],
  });

  await db.friendRequest.delete({
    where: { id: request.id },
  });

  await pusherServer.trigger(senderId, 'friend:accepted', {
    receiverId: session.user.id,
  });

  await pusherServer.trigger(session.user.id, 'friend:confirmed', {
    senderId,
  });

  return new NextResponse("Friend request accepted", { status: 200 });
}
