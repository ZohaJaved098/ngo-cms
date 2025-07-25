"use client";
// import Link from "next/link";
import {
  // useDispatch,
  useSelector,
} from "react-redux";

import { RootState } from "@/app/redux/store";

import { FaCog, FaUserCog, FaHome, FaRegImages } from "react-icons/fa";
import { FaUsers, FaRegRectangleList } from "react-icons/fa6";
import { MdOutlineEvent } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import { RiPagesLine } from "react-icons/ri";

import ActiveLink from "./ActiveLink";
const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-w-3xs h-screen max-h-full overflow-y-scroll p-5 bg-blue-700 text-white flex flex-col gap-5 items-start">
      <div className="flex flex-col gap-5">
        <h3 className="text-2xl font-bold capitalize">{user.role} Panel</h3>
        <p className="text-xl font-semibold capitalize">
          Hello {user.username}!
        </p>
      </div>
      <hr className=" w-full bg-white" />
      {/* links */}
      <div className="flex flex-col gap-5 w-full ">
        <ActiveLink
          href="/dashboard"
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <TfiDashboard className="w-5 h-5" />
          <p>Dashboard</p>
        </ActiveLink>
        <ActiveLink
          href={"/dashboard/pages"}
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <RiPagesLine className="w-5 h-5" />
          <p>Pages</p>
        </ActiveLink>
        <ActiveLink
          href={"/dashboard/image-sliders"}
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <FaRegImages className="w-5 h-5" />
          <p>Images Slider</p>
        </ActiveLink>
        <ActiveLink
          href={"/dashboard/blogs"}
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <FaRegRectangleList className="w-5 h-5" />
          <p>Blogs</p>
        </ActiveLink>
        <ActiveLink
          href={"/dashboard/events"}
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
        </ActiveLink>
        {/* <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
          </span>
          <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
          </span>
          <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
          </span>
          <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
          </span>
          <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
          </span>
          <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <MdOutlineEvent className="w-5 h-5" />
          <p>Events</p>
          </span> */}
        {user.role === "admin" && (
          <ActiveLink
            href={"/dashboard/users"}
            className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
          >
            <FaUsers className="w-5 h-5" />
            <p>Users Management</p>
          </ActiveLink>
        )}
        <ActiveLink
          href={"/"}
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <FaHome className="w-5 h-5" />
          <p>See website</p>
        </ActiveLink>
      </div>
      <hr className=" w-full bg-white" />
      <div className="flex flex-col gap-5 w-full ">
        <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <FaCog className="w-5 h-5" />
          Settings
        </span>
        <span className="flex gap-5 items-center justify-normal w-full cursor-pointer ">
          <FaUserCog className="w-5 h-5" />
          My Profile
        </span>
        <span></span>
      </div>
    </div>
  );
};

export default Sidebar;
