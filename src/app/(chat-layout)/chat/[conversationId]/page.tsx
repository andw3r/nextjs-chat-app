'use client';

import ChatBox from "@/components/ChatBox";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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

  return <ChatBox conversationId={conversationId} messages={messages} />;
}
