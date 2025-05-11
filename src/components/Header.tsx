"use client";

import { IoSettingsOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationMenu from "./NotificationMenu";
import { Router, useRouter } from "next/router";
import { usePathname } from "next/navigation";


export default function Header() {

  const pathname = usePathname();
  const isChat = pathname === "/chat";

  return (
    <header className="pl-2 w-full min-h-11 flex justify-between items-center bg-background border rounded-lg">
      {isChat && <h1 className="select-none">ICG chat</h1>}
      <div>
        <NotificationMenu />
      </div>
    </header>
  );
}