"use client";

import NotificationMenu from "./NotificationMenu";


export default function Header({ chatName }: { chatName?: string }) {
  return (
    <header className="pl-2 w-full min-h-11 flex justify-between items-center bg-background border rounded-lg">
      <h1 className="select-none">{chatName}</h1>
      <div>
        <NotificationMenu />
      </div>
    </header>
  );
}