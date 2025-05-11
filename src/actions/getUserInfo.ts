import { db } from '@/lib/db';


export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Could not fetch user by email');
  }
}

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Could not fetch user by ID');
  }
}

export const getUserFromDb = async (email: string, hashedPassword: string) => {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user || user.hashedPassword !== hashedPassword) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}

export const getAllUsers = async (currentUserId: string | undefined) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        id: {
          not: currentUserId,
        },
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Could not fetch all users');
  }
};



