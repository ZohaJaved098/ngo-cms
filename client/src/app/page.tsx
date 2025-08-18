"use client";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import HomeSlider from "./components/HomeSlider";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="h-screen mt-32">
      <HomeSlider />
      <h1 className="text-purple-600 text-3xl my-10">Hello {user.username}</h1>
    </div>
  );
}
