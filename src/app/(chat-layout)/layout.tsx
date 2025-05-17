import Header from "@/components/Header";
import NotificationMenu from "@/components/NotificationMenu";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatLayout({ children } : { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row h-full w-full p-3 gap-3">
      <Sidebar />
      {children}
    </div>
  );
}