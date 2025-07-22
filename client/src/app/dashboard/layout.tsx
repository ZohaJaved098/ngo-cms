export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`w-full h-full overflow-y-scroll flex justify-center items-center`}
    >
      {children}
    </div>
  );
}
