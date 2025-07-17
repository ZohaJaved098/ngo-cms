export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/50">
      <div
        className={`w-1/2 m-auto mt-3 rounded-lg p-4 bg-blue-400 auth_gradient text-black`}
      >
        {children}
      </div>
    </div>
  );
}
