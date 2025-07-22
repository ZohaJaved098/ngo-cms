export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/50">
      <div
        className={`w-full sm:w-1/2 h-full mx-auto m-5 sm:my-20 p-10 bg-blue-400 auth_gradient text-white overflow-y-scroll flex justify-center items-center`}
      >
        {children}
      </div>
    </div>
  );
}
