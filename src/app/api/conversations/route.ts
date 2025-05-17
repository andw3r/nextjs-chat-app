import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      console.error("Unauthorized access");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Checking for existing conversation...");

    const existingConversation = await db.conversation.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [currentUser.id, userId],
            },
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    if (existingConversation) {
      console.log("Conversation already exists");
      return NextResponse.json(existingConversation);
    }

    console.log("Creating new conversation...");
    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [
            { id: currentUser.id },
            { id: userId },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.error("Error in conversation creation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
