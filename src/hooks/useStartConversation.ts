import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export function useStartConversation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) throw new Error("Invalid user ID");

      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to start conversation");
      const data = await res.json();
      console.log("Conversation started:", data);
      return data;

    },
    onSuccess: (data) => {
      router.push(`/chat/${data.id}`);
    },
    onError: (err) => {
      console.error("Error starting conversation:", err);
    },
  });
}
