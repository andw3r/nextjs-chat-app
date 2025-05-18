'use client';

import ChatBox from "@/components/ChatBox";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import FriendsList from "@/components/FriendsList";
import Header from "@/components/Header";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params?.conversationId as string;

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json();
    },
    enabled: !!conversationId,
  });



  return (
    <div className="flex w-full gap-3">
      <div className="hidden lg:flex">
        <FriendsList />
      </div>
      <div className="flex flex-col gap-3 h-full w-full">
        <Header />
      {isLoading ? (
        <main className="w-full h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] flex items-center justify-center bg-primary-gray rounded-xl">
          Loading chat...
        </main>
      ) : error || !messages ? (
        <main className="w-full h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] flex items-center justify-center bg-primary-gray rounded-xl">
          Failed to load messages.
        </main>
      ) : (
        <ChatBox
          conversationId={conversationId}
          messages={messages}
        />
      )}
      </div>
    </div>
  )
}
