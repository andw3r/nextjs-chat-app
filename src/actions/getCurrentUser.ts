import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;
  console.log("Session:", session);
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return user;
};