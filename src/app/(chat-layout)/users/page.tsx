"use client"
import Link from "next/link";

export default function Users() {

  return (
    <div className="flex h-full w-full justify-center items-center gap-3">
      <div className="text-center w-1/2 text-lg">
        <span>Send a friend request to someone to start a conversation or start a conversation with </span><Link className="underline text-button-yellow" href="/chat"> your friends</Link>
      </div>
    </div>
  );
}
