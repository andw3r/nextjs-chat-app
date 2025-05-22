"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/chat");
    }
  }, [status, router]);

  return (
    <div className="flex h-full w-full justify-center items-center gap-3">
      <div className="flex flex-col items-center justify-center text-center sm:w-1/2 sm:text-lg">
        <p>Welcome to Real time chat app!</p>
        <div>Start using the chat by <Link href="/login" className="underline text-button-yellow">signing up</Link> a new account.</div>
      </div>
    </div>
  );
}