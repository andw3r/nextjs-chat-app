"use client";

import { signOut, useSession } from "next-auth/react";
import ActionIcon from "../ActionIcon";
import ProfileButton from "../ProfilePicture";
import { BsChatDots } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import Image from "next/image";
import { ThemeToggler } from "./ThemeToggler";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { TbLogout2 } from "react-icons/tb";

export default function Sidebar() {

  return (
    <aside className="flex flex-col justify-between items-center w-14 bg-background h-full rounded-xl py-1.5 gap-2">
      {/* top menu */}
      <div className="flex flex-col gap-2">
        <Link href="/chat">
          <ActionIcon>
            <BsChatDots />
          </ActionIcon>
        </Link>

        <Link href="/users">
          <ActionIcon>
            <BsPeople />
          </ActionIcon>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-2">
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