import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const currentUserId = session.user.id;

    const friends = await db.friend.findMany({
      where: { user: { id: session.user.id } },
      select: {
        friend: {
          select: { id: true, name: true, image: true,  }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedFriends = await Promise.all(
      friends.map(async (friend) => {
        const conversation = await db.conversation.findFirst({
          where: {
            userIds: {
              hasEvery: [currentUserId, friend.friend.id],
            },
          },
          select: {
            id: true,
          },
        });

        if (!conversation) {
          return {
            ...friend,
            lastMessage: null,
            fromMe: false,
          };
        }

        const lastMessage = await db.message.findFirst({
          where: {
            conversationId: conversation.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            body: true,
            senderId: true,
          },
        });

        return {
          ...friend,
          conversationId: conversation?.id ?? null,
          lastMessage: lastMessage?.body || null,
          fromMe: lastMessage?.senderId === currentUserId,
        };
      })
    );

    const formattedFriends = enrichedFriends.map((entry) => ({
      id: entry.friend.id,
      name: entry.friend.name,
      image: entry.friend.image,
      lastMessage: entry.lastMessage,
      fromMe: entry.fromMe,
    }));

    return NextResponse.json(formattedFriends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
