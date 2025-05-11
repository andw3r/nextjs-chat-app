"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import LetterAvatar from "./LetterAvatar";

interface ProfilePictureProps {
  customPicture?: string;
  customName?: string;
  size: number;
}

export default function ProfilePicture({customPicture, customName, size}: ProfilePictureProps) {
  const { data: session } = useSession();

  const isCurrentUser = !customPicture && !customName;

  const imageSrc = isCurrentUser
    ? session?.user?.image
    : customPicture;

  const name = isCurrentUser
    ? session?.user?.name
    : customName;

  const showFallbackIcon = !imageSrc;

  return (
    <div className="rounded-full select-none">
      {showFallbackIcon ? (
        <LetterAvatar name={name as string} size={size} />
      ) : (
        <Image
          className="rounded-full"
          alt="profile"
          src={imageSrc}
          width={size}
          height={size}
        />
      )}
    </div>
  );
}
