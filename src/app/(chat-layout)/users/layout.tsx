import { useQuery } from '@tanstack/react-query';
import UsersChatList from '@/components/UsersList';
import { getAllUsers } from '@/actions/getUserInfo';
import { auth } from '@/lib/auth';
import Header from '@/components/Header';

export default async function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();
  // const users = await getAllUsers(session?.user?.id);

  // const { data: pendingRequests = [] } = useQuery({
  //   queryKey: ['pendingRequests'],
  //   queryFn: async () => {
  //     const res = await fetch('/api/friends/pending')
  //     return res.json()
  //   },
  //   refetchInterval: 5000,
  // })

  return (
    <div className="flex w-full gap-3">
      <UsersChatList />
      <div className="flex flex-col gap-2 w-full">
        <Header />
        {children}
      </div>
    </div>
  );
}
