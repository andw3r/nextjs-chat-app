import { NextResponse } from "next/server";
import { auth,} from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const { senderId } = await req.json();

  if (!session?.user?.id || !senderId) {
    return new NextResponse("Unauthorized or bad request", { status: 400 });
  }

  const userId = session.user.id;

  const request = await db.friendRequest.findFirst({
    where: {
      senderId,
      receiverId: userId,
    },
  });

  if (!request) {
    return new NextResponse("No friend request found", { status: 404 });
  }

  await db.friendRequest.delete({
    where: { id: request.id },
  });

  return new NextResponse("Friend request deleted", { status: 200 });
}
