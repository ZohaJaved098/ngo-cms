"use client";
import { useSelector } from "react-redux";

import { RootState } from "@/app/redux/store";
import { SideMenuData } from "../util/sideMenuData";
import { FaCog, FaUserCog, FaHome } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

import { TfiDashboard } from "react-icons/tfi";
import ActiveLink from "./ActiveLink";
import Title from "./Title";
const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-w-3xs h-screen max-h-full overflow-y-scroll p-5 bg-blue-700 text-white flex flex-col gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Title className="text-white" text={`${user.role} Panel`} />
        <p className="text-xl font-semibold capitalize">
          Hello {user.username}!
        </p>
      </div>
      <hr className=" w-full bg-white" />

      <div className="flex flex-col gap-5 w-full ">
        <ActiveLink
          href="/dashboard"
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <TfiDashboard className="w-5 h-5" />
          <p>Dashboard</p>
        </ActiveLink>
        <ActiveLink
          href={"/"}
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <FaHome className="w-5 h-5" />
          <p>Our NGO App </p>
        </ActiveLink>
        <hr className=" w-full bg-white" />
        {SideMenuData.map((menu) => (
          <div key={menu.id} className="flex flex-col gap-5 w-full ">
            <h3 className="font-bold">{menu.title}</h3>
            {menu.links.map((item) => (
              <ActiveLink
                key={item.name}
                href={`/dashboard/${item.link}`}
                className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
              >
                {item.icon}
                <p>{item.name}</p>
              </ActiveLink>
            ))}
            <hr className=" w-full bg-white" />
          </div>
        ))}

        {user.role === "admin" && (
          <>
            <h3 className="font-bold">Admin Only</h3>
            <ActiveLink
              href={"/dashboard/users"}
              className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
            >
              <FaUsers className="w-5 h-5" />
              <p>Users Management</p>
            </ActiveLink>
          </>
        )}
      </div>
      <hr className=" w-full bg-white" />
      <h3 className="font-bold">Personal </h3>
      <div className="flex flex-col gap-5 w-full ">
        <span
          // href="/dashboard/profile"
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <FaCog className="w-5 h-5" />
          Settings (demo)
        </span>
        <ActiveLink
          href="/dashboard/profile"
          className="flex gap-5 items-center justify-normal w-full cursor-pointer p-2 hover:bg-blue-400/50 rounded-lg"
        >
          <FaUserCog className="w-5 h-5" />
          My Profile
        </ActiveLink>
      </div>
    </div>
  );
};

export default Sidebar;
