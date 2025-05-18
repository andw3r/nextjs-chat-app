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

  if (isLoading) return <div>Loading chat...</div>;
  if (error || !messages) return <div>Failed to load messages.</div>;

  return (
    <div className="flex w-full gap-3">
      <div className="hidden lg:flex">
        <FriendsList />
      </div>
      <div className="flex flex-col gap-3 h-full w-full">
        <Header />
        <ChatBox conversationId={conversationId} messages={messages} />
      </div>
    </div>
  )
}
