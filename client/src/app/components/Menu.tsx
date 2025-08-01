"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

import { FaChevronDown } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineEventNote } from "react-icons/md";
import { TfiLayoutMediaCenter } from "react-icons/tfi";
// import { GrGallery } from "react-icons/gr";
import { TfiDashboard } from "react-icons/tfi";

import SubMenu from "./SubMenu";
const Menu = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [menuOpened, setMenuOpened] = useState(false);
  const [subMenu, setSubMenu] = useState<"media" | "event" | null>(null);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setMenuOpened(true);
      } else {
        setMenuOpened(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex">
      {/* Menu button */}
      <span
        className="flex sm:hidden flex-col items-center group relative"
        onClick={() => setMenuOpened(!menuOpened)}
      >
        <RxHamburgerMenu
          title="menu"
          className="w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all"
        />
      </span>

      {/* list */}
      <div
        className={`${
          menuOpened
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible"
        } absolute top-full right-0 sm:static sm:top-0 sm:right-0 w-full sm:w-auto max-h-[80vh] p-5 sm:p-0 rounded-lg sm:rounded-none shadow-lg sm:shadow-none bg-gray-200 sm:bg-transparent transition-all duration-500 ease-in-out origin-top transform`}
      >
        <ul className="flex sm:flex-row flex-col gap-5 sm:justify-center sm:items-start mx-auto">
          {/* Media MENU ITEM */}
          <li
            className="flex flex-col items-start gap-2 group relative"
            onClick={() =>
              setSubMenu((prev) => (prev === "media" ? null : "media"))
            }
          >
            <span className="flex justify-between items-center w-full gap-3">
              <div className="flex sm:flex-col sm:gap-0 gap-3 items-center">
                <TfiLayoutMediaCenter className=" w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
                <p className="text-sm sm:font-light group-hover:font-semibold ">
                  Media
                </p>
              </div>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  subMenu === "media" ? "rotate-180" : ""
                }`}
              />
            </span>
            <SubMenu menuType="media" isOpen={subMenu === "media"} />
          </li>

          {/* EVENT MENU ITEM */}
          <li
            className="flex flex-col items-start group relative  "
            onClick={() =>
              setSubMenu((prev) => (prev === "event" ? null : "event"))
            }
          >
            <span className="flex justify-between items-center w-full gap-3 ">
              <div className="flex sm:flex-col sm:gap-0 gap-3 items-center">
                <MdOutlineEventNote className="w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
                <p className="text-sm font-light group-hover:font-semibold ">
                  Event
                </p>
              </div>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  subMenu === "event" ? "rotate-180" : ""
                }`}
              />
            </span>
            <SubMenu menuType="event" isOpen={subMenu === "event"} />
          </li>

          {/* Other Links */}
          {/* <li className="group">
            <Link
              href="/"
              className="flex sm:flex-col sm:gap-0 gap-3 items-center "
            >
              <GrGallery className=" w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
              <p className="text-sm font-light group-hover:font-semibold">
                Gallery
              </p>
            </Link>
          </li> */}
          {(user.role === "admin" || user.role === "manager") && (
            <li className="group">
              <Link
                href="/dashboard"
                className="flex sm:flex-col sm:gap-0 gap-3 items-center "
              >
                <TfiDashboard className=" w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
                <p className="text-sm font-light group-hover:font-semibold">
                  Dashboard
                </p>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
