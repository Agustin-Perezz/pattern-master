export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col animate-in fade-in-0 duration-400">
      {children}
    </div>
  );
}
