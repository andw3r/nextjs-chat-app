import PendingRequest from '@/types/PendingRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: string) => {
      const res = await fetch("/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      });

      if (!res.ok) throw new Error("Failed to send friend request");
      return res.text();
    },

    onError: (err) => {
      console.error("Friend request error:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    }
  });
}
