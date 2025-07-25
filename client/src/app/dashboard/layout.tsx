import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`w-screen h-screen flex `}>
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
}
