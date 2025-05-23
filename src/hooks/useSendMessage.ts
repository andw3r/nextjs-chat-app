import { useMutation, useQueryClient } from "@tanstack/react-query";

interface MessageProps {
  message: string;
  conversationId: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["friends"]});
    },

    onError: (err) => {
      console.error("Send message error:", err);
    },
  });
}
