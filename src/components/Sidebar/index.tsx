"use client";

import { signOut } from "next-auth/react";
import ActionIcon from "../ActionIcon";
import ProfileButton from "../ProfilePicture";
import { BsChatDots } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { ThemeToggler } from "./ThemeToggler";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TbLogout2 } from "react-icons/tb";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathName = usePathname();
  const chatPath = pathName.startsWith("/chat")
  const usersPath = pathName.startsWith("/users")

  return (
    <aside className="flex lg:flex-col justify-center lg:justify-between items-center bg-background w-full lg:w-14 lg:h-full rounded-xl py-1.5 gap-2">
      <div className="flex lg:flex-col gap-2">
        <Link href="/chat">
          <ActionIcon active={chatPath}>
            <BsChatDots />
          </ActionIcon>
        </Link>

        <Link href="/users">
          <ActionIcon active={usersPath}>
            <BsPeople />
          </ActionIcon>
        </Link>
      </div>

      <div className="flex lg:flex-col items-center gap-2">
        <ThemeToggler />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <ProfileButton size={36} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => signOut({ redirectTo: '/' })}>
              <TbLogout2 />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}