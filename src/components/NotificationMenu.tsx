'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { MdCheckCircleOutline } from "react-icons/md";
import dynamic from "next/dynamic";
import { pusherClient } from '@/lib/pusher';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
const ProfilePicture = dynamic(() => import("./ProfilePicture"), { ssr: false });

interface PendingRequest {
  senderId: string;
  senderName: string;
  senderImage: string;
  sent: string;
}

export default function NotificationMenu() {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: async () => {
      const res = await fetch('/api/friends/pending')
      return res.json();
    },
    refetchInterval: 5000,
  })

  const useAcceptPendingRequest = () => {
    return useMutation({
      mutationFn: async (senderId: string) => {
        const res = await fetch("/api/friends/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId }),
        });

        if (!res.ok) throw new Error("Failed to accept friend request");
        return res.text();
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
        queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
      }
    })
  }

  const { mutate: acceptPendingRequest } = useAcceptPendingRequest();


  const useDeletePendingRequest = () => {
    return useMutation({
      mutationFn: async (senderId: string) => {
        const res = await fetch("/api/friends/deny", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId }),
        });

        if (!res.ok) throw new Error("Failed to deny friend request");
        return res.text();
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
        queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      }
    })
  }

  const { mutate: deletePendingRequest } = useDeletePendingRequest();

    useEffect(() => {
    if (!session?.user?.id) return;

    pusherClient.subscribe(session.user.id);

    const handler = (data: { senderId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    };

    pusherClient.bind('friend:accepted', handler);

    return () => {
      pusherClient.unsubscribe(session.user.id as string);
      pusherClient.unbind('friend:accepted', handler);
    };
  }, [session?.user?.id, queryClient]);

  useEffect(() => {
    if (!session?.user?.id) return;

    pusherClient.subscribe(session.user.id);

    const handler = (data: { senderId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
    };

    pusherClient.bind('friend:denied', handler);

    return () => {
      pusherClient.unsubscribe(session.user.id as string);
      pusherClient.unbind('friend:denied', handler);
    };
  }, [session?.user?.id, queryClient]);

  useEffect(() => {
    if (!session?.user?.id) return;

    pusherClient.subscribe(session.user.id);

    const handler = (data: { senderId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    };

    pusherClient.bind('friend:confirmed', handler);

    return () => {
      pusherClient.unsubscribe(session.user.id as string);
      pusherClient.unbind('friend:confirmed', handler);
    };
  }, [session?.user?.id, queryClient]);

  return (
    <div className="relative z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-background h-8 w-8 flex justify-center items-center rounded-full cursor-pointer relative z-50">
            <IoMdNotificationsOutline className="cursor-pointer w-5 h-5" />
            {pendingRequests.length > 0 && <span className="select-none absolute flex justify-center items-center top-1 left-1 bg-amber-950 h-3 w-3 text-xs rounded-full text-white">{pendingRequests.length}</span>}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ">
          <div className="absolute right-3 top-4.5 w-80 bg-background border flex flex-col rounded-lg shadow-xl z-50">
            <div className="flex flex-col gap-2 p-3">
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col gap-2 p-3">
                  <h5 className="text-md font-medium text-center select-none">No friend requests</h5>
                </div>
              ) : (
                <h5 className="text-md font-medium text-center select-none">Friend requests</h5>
              )}
              <div className="flex flex-col gap-2">
                {pendingRequests.map((req: PendingRequest) => {
                  return (
                    <div key={req.senderId} className="flex justify-between items-center gap-2 border rounded-xl p-2">
                      <div className="flex flex-col gap-2">
                        <div className='flex gap-2 items-center'>
                          <ProfilePicture customName={req.senderName} customPicture={req.senderImage} size={20} />
                          <div className="text-sm select-none">{req.senderName}</div>
                        </div>
                        <div className="text-[10px] opacity-60">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short",}).format(new Date(req.sent))}</div>
                      </div>
                      <div className="flex gap-1">
                        <div className="text-red-400 cursor-pointer" onClick={() => deletePendingRequest(req.senderId)}>
                          <MdOutlineCancel fontSize={22}/>
                        </div>
                        <div className="text-green-400 cursor-pointer" onClick={() => acceptPendingRequest(req.senderId)}>
                          <MdCheckCircleOutline fontSize={22} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
