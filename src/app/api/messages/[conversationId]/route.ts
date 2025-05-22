import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const currentUser = await getCurrentUser();
  const { conversationId } = await params;

  if (!currentUser) return new NextResponse("Unauthorized", { status: 401 });

  const messages = await db.message.findMany({
    where: { conversationId },
    select: {
      id: true,
      body: true,
      sender: true,
      seen: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
