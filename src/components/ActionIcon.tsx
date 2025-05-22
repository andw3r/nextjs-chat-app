"use client";

interface ActionIconProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function ActionIcon({
  children,
  active = false,
  onClick,
}: Readonly<ActionIconProps>) {
  return (
    <div onClick={onClick} className={`${active ? "bg-accent" : "bg-primary-gray"}  border h-9 w-9 rounded-md flex justify-center items-center`}>{children}</div>
  );
}