import PendingRequest from '@/types/PendingRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receiverId: string) => {
      await fetch("/api/friends/unsend", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      });
    },

    onError: (err) => {
      console.error("Friend request error:", err);
    },
    // onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      // queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    // }
  });
}
