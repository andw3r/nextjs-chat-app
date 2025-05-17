import { useMutation } from "@tanstack/react-query";

interface MessageProps {
  message: string;
  conversationId: string;
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ message, conversationId }: MessageProps) => {
      if (!conversationId) throw new Error("Invalid conversation ID");

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onError: (err) => {
      console.error("Send message error:", err);
    },
  });
}
