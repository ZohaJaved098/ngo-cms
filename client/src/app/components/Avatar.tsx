"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { FaHistory, FaUserCog } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";

import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/app/redux/store";
import { logout } from "@/app/redux/auth/authSlice";
import { useRouter } from "next/navigation";

const Avatar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const router = useRouter();

  const [avatarOpened, setAvatarOpened] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setAvatarOpened(false);
  }, [pathname]);

  //logout logic here
  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div className="flex">
      {/* Avatar button */}
      <span
        className="flex flex-col items-center group relative"
        onClick={() => setAvatarOpened(!avatarOpened)}
      >
        <FaRegUserCircle
          title="Avatar"
          className="w-5 h-5 group-hover:w-7 group-hover:h-7 transition-all"
        />
        <p className="hidden sm:block text-sm font-light group-hover:font-semibold ">
          Avatar
        </p>
      </span>

      {/* list */}
      <div
        className={`${
          avatarOpened
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible"
        } absolute top-full right-0 w-1/4 max-h-[80vh] p-5 rounded-lg sm:rounded-none shadow-lg bg-gray-200 transition-all duration-500 ease-in-out origin-top transform`}
      >
        <ul className="flex flex-col gap-5  mx-auto">
          <li className="">
            <p className="text-md font-semibold">{user.username}</p>
          </li>
          <hr />
          {user.username === "Guest" ? (
            <li className="cursor-pointer">
              <Link href="/auth/login" className="flex items-center gap-2">
                <IoMdLogIn />
                <p className="text-sm">Login</p>
              </Link>
            </li>
          ) : (
            <>
              <li className="cursor-pointer">
                <Link href="/" className="flex items-center gap-2">
                  <FaHistory />
                  <p className="text-sm">My Donation History</p>
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/" className="flex items-center gap-2">
                  <FaUserCog />
                  <p className="text-sm">My Profile</p>
                </Link>
              </li>
              <hr />
              <li className="cursor-pointer" onClick={handleLogout}>
                <span className="flex items-center gap-2">
                  <IoMdLogOut />
                  <p className="text-sm">Logout</p>
                </span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Avatar;
