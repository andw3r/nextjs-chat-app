import { useMutation } from '@tanstack/react-query';

export function useDeleteFriendRequest() {

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
  });
}
