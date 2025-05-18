"use client";

import { BsSend } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useSendMessage } from "@/hooks/useSendMessage";
import ProfilePicture from "./ProfilePicture";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  seen: boolean;
  sender: {
    id: string;
    name: string;
    image: string;
  };
}

interface ChatBoxProps {
  conversationId: string;
  messages: Message[];
}

export default function ChatBox({ conversationId, messages: initialMessages }: ChatBoxProps) {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");

  const { mutate: sendMessage } = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const handleNewMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    pusherClient.bind("messages:new", handleNewMessage);

    return () => {
      pusherClient.unbind("messages:new", handleNewMessage);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageHandler = () => {
    if (!message.trim()) return;

    sendMessage({ message, conversationId });
    setMessage("");
  };

  const sendMessageOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessageHandler();
  };

  return (
    <main className="w-full h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] relative flex flex-col gap-8 bg-primary-gray rounded-xl">
      <div className="flex-1 overflow-y-auto px-3 pt-4 space-y-5">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1.5 w-full ${msg.sender.id === session?.user?.id ? "items-end" : "items-start"}`}>
              <div className={`flex gap-2 items-center ${msg.sender.id === session?.user?.id && "flex-row-reverse"}`}>
                <ProfilePicture customName={msg.sender.name} customPicture={msg.sender.image} size={38} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm select-none">{msg.sender.name}</h3>
                  <p className="text-sm">{msg.body}</p>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="flex flex-col gap-1.5 w-full h-full items-center justify-center">
              <h3 className="text-sm select-none">No messages yet</h3>
            </div>
          )}
          <div ref={bottomRef} />
      </div>

      <div className="w-[calc(100%-24px)] h-12 flex mx-auto relative bottom-6 bg-background border rounded-xl">
        <input
          autoFocus
          placeholder="Write a message..."
          value={message}
          onKeyDown={sendMessageOnEnter}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          className="pl-4 flex w-full outline-none"
        />
        <div className="cursor-pointer w-12 h-12" onClick={sendMessageHandler}>
          <BsSend className="absolute top-1/2 -translate-y-1/2 right-4" />
        </div>
      </div>
    </main>
  );
}
