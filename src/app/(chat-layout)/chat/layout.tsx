import { auth } from "@/lib/auth"
import Header from "@/components/Header";
import FriendsList from "@/components/FriendsList";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <div className="flex w-full gap-3">
      <FriendsList />
      <div className="flex flex-col gap-3 w-full">
        <Header />
        {children}
      </div>
    </div>
  );
}
