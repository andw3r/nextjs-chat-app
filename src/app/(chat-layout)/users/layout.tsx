import UsersChatList from '@/components/UsersList';
import Header from '@/components/Header';

export default async function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col-reverse sm:flex-row w-full h-[calc(100%-60px)] lg:h-auto gap-3">
      <UsersChatList />
      <div className="flex flex-col gap-2 w-full">
        <Header />
        {children}
      </div>
    </div>
  );
}
