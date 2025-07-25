"use client";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="h-screen mt-32">
      <h1 className="text-purple-600 text-3xl">Hello {user.username}</h1>
    </div>
  );
}
