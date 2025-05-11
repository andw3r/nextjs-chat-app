interface LetterAvatarProps {
  name?: string;
  size: number;
}

export default function LetterAvatar({ name = "User", size }: LetterAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const bgColors = ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
  const bgColor = bgColors[name.length % bgColors.length];

  return (
    <div
      className={`flex items-center justify-center ${bgColor} text-white font-medium rounded-full`}
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initials}
    </div>
  );
}
