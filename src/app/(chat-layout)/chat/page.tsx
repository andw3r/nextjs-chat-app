"use client"

import FriendsList from "@/components/FriendsList";
import Header from "@/components/Header";

export default function Chat() {
  return (
    <div className="flex flex-col-reverse sm:flex-row w-full h-full lg:h-auto gap-3">
      <FriendsList />
      <div className="flex flex-col gap-2 w-full">
        <Header />
        <div className="hidden sm:flex h-full w-full justify-center items-center gap-3">
          <div className="text-center w-1/2 text-lg">
            <span>Start a conversation with your friend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
