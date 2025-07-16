export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`w-1/2 m-auto mt-10 rounded-lg p-4 bg-blue-400 text-black`}>
      {children}
    </div>
  );
}
