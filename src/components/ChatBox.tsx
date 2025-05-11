"use client";

import { GrAttachment } from "react-icons/gr";
import { BsSend } from "react-icons/bs";
import { PiSticker } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSendMessage } from "@/hooks/useSendMessage";
import ProfilePicture from "./ProfilePicture";
import { useSession } from "next-auth/react";

interface ChatBoxProps {
  conversationId: string;
  messages: [{
    id: string;
    body: string;
    createdAt: string;
    seen: boolean;
    sender: {
      id: string;
      name: string;
      image: string;
    };
  }];
}

export default function ChatBox({ conversationId, messages }: ChatBoxProps) {
  const { data: session } = useSession();

  const [message, setMessage] = useState("");
  const { mutate: sendMessage } = useSendMessage();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessageOnEnter = (e: any) => {
    if (e.key === "Enter" && message.trim() !== "") {
      sendMessage({ message, conversationId });
      setMessage("");
    }
  };
  return (
    <main className="w-full h-[calc(100vh-80px)] relative flex flex-col gap-8 bg-primary-gray rounded-xl">
      <div className="w-full flex flex-col flex-1 overflow-y-auto px-3 gap-5">
        {messages?.map((message) => (
          <div ref={bottomRef} key={message.id} className={`flex flex-col gap-1.5 w-full ${message.sender.id === session?.user?.id ? "items-end" : "items-start"}`}>
            <div className={`flex gap-2 items-center ${message.sender.id === session?.user?.id && "flex-row-reverse"}`}>
              <ProfilePicture customName={message.sender.name} customPicture={message.sender.image} size={38} />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm select-none">{message.sender.name}</h3>
                <p className="text-sm">{message.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[calc(100%-24px)] h-12 flex mx-auto relative bottom-6 bg-secondary-gray rounded-xl">
        <GrAttachment className="absolute top-1/2 -translate-y-1/2 left-3" />
        <input autoFocus placeholder="Write a message..." value={message} onKeyDown={sendMessageOnEnter} onInput={(e: any) => setMessage(e.target.value)} type="text" className="pl-10 flex w-full outline-none" />
        <PiSticker className="absolute top-1/2 -translate-y-1/2 right-10" height={20} width={20} />
        <div className="cursor-pointer w-12 h-12" onClick={() => {if (message.trim() === "") return; sendMessage({ message, conversationId }); setMessage(""); }}><BsSend className="absolute top-1/2 -translate-y-1/2 right-4" /></div>
      </div>
    </main>
  );
}