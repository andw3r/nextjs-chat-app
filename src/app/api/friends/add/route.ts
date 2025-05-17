import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const session = await auth();

  const { receiverId } = await req.json();

  if (!session?.user?.id || !receiverId) {
    return new NextResponse("Unauthorized or bad request", { status: 400 });
  }

  const currentUserId = session.user.id;

  const exists = await db.friendRequest.findFirst({
    where: {
      senderId: currentUserId,
      receiverId,
    },
  });

  if (exists) {
    return new NextResponse("Friend request already sent", { status: 409 });
  }

   const existingFriendship = await db.friend.findFirst({
    where: {
      OR: [
        { userId: currentUserId, friendId: receiverId },
        { userId: receiverId, friendId: currentUserId },
      ],
    },
  });

    if (existingFriendship) {
    return NextResponse.json({ error: "Already friends" }, { status: 400 });
  }


  await db.friendRequest.create({
    data: {
      senderId: currentUserId,
      receiverId,
    },
  });

  await pusherServer.trigger(receiverId, 'friend:request', {
    senderId: currentUserId,
  });

  await pusherServer.trigger(currentUserId, 'friend:request', {
    receiverId,
  });
  
  return new NextResponse("Friend request sent", { status: 200 });
}
