"use client";

import { usePathname } from "next/navigation";
import NotificationMenu from "./NotificationMenu";
import { useState } from "react";


export default function Header() {
  const pathName = usePathname();

  const pathNameList = ["Conversations", "People", "Settings"];


  return (
    <header className="pl-2 w-full min-h-11 flex justify-between items-center bg-background border rounded-lg">
      <h1 className="select-none">{pathName.startsWith("/users")  ? "People" : "Conversations"}</h1>
      <div>
        <NotificationMenu />
      </div>
    </header>
  );
}