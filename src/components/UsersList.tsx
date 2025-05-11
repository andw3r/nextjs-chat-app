"use client";

import { BsPersonCircle } from "react-icons/bs";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllUsers } from '@/actions/getUserInfo';
import { useSession } from "next-auth/react";
import { useSendFriendRequest } from "@/hooks/useSendFriendRequest";
import PendingRequest from "@/types/PendingRequest";
import { usePathname } from "next/navigation";
import ProfilePicture from "./ProfilePicture";

interface UserList {
  id: string;
  name: string;
  image: string;
}

export default function UsersList() {
  const pathname = usePathname();

  const { data: session } = useSession();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users/non-friends');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    enabled: !!session?.user?.id,
  });

  const { data: sentRequests = [] } = useQuery({
    queryKey: ['sentRequests'],
    queryFn: async () => {
      const res = await fetch('/api/friends/sent')
      return res.json();
    },

    refetchInterval: 5000,
  })

  const { mutate: sendFriendRequest } = useSendFriendRequest();

  return (
    <div className="flex flex-col gap-3 h-full bg-background p-1.5 rounded-xl overflow-x-hidden min-w-fit">
      {users.map((user: UserList) => {
        const alreadyRequested = sentRequests.some(
          (req: PendingRequest) => req.senderId === session?.user?.id && req.receiverId === user.id
        );
        return (
          <div key={user?.id} className={`${pathname === "/chat" ? "cursor-pointer" : ""} min-h-14 bg-primary-gray border rounded-xl flex w-60`}>
            <div className="flex w-full justify-between items-center gap-2 mx-2">
              <div className="flex gap-2 items-center">
                <ProfilePicture customName={user.name} customPicture={user.image} size={32} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm select-none">{user.name}</h3>
                  {pathname === "/chat" && <span className="text-xs opacity-60">{"Write a new message..."}</span>}
                </div>
              </div>
              {alreadyRequested ? (
                  <IoCheckmark className="w-4 h-4" />
                ) : (
                  <IoPersonAddOutline
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => sendFriendRequest(user.id)}
                  />
                )
              }
            </div>
          </div>
        )
      })}
    </div>
  );
}