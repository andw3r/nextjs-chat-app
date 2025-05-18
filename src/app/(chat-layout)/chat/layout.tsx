export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex w-full h-full lg:h-auto gap-3">
      {children}
    </div>
  );
}
