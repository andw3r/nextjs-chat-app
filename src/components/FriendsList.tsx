"use client";

import { useQuery } from '@tanstack/react-query';
import { useSession } from "next-auth/react";
import ProfilePicture from "./ProfilePicture";
import { useStartConversation } from '@/hooks/useStartConversation';

interface FriendsList {
  id: string;
  name: string;
  image: string;
}

export default function FriendsList() {

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch('/api/friends');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  const { mutate: startConversation } = useStartConversation();

  return (
    <div className="flex flex-col gap-3 h-full bg-background p-1.5 rounded-xl overflow-x-hidden min-w-fit">
      {friends.map((friend: FriendsList) => {
        return (
          <div key={friend.id} onClick={() => startConversation(friend.id)} className="cursor-pointer min-h-14 bg-primary-gray border rounded-xl flex w-60">
            <div className="flex w-full justify-between items-center gap-2 mx-2">
              <div className="flex gap-2 items-center">
                <ProfilePicture customName={friend.name} customPicture={friend.image} size={32} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm select-none">{friend.name}</h3>
                  <span className="text-xs opacity-60">{"Write a new message..."}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}