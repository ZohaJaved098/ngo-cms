"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaChevronDown,
  FaHistory,
  FaUserCog,
  FaBloggerB,
} from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineEventNote } from "react-icons/md";

const Menu = () => {
  const [isDropdowned, setIsDropdowned] = useState({
    blog: false,
    event: false,
  });
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <>
      <span
        className="flex md:hidden flex-col items-center group"
        onClick={() => {
          setMenuOpened(!menuOpened);
        }}
      >
        <RxHamburgerMenu
          title="menu"
          className="w-5 h-5 group-hover:w-7 group-hover:h-7 transition-all"
        />
      </span>
      <div
        className={`absolute right-2 top-full z-10 mt-2 w-56 p-5 rounded-lg shadow-lg border-2 border-gray-600 bg-gray-200 transition-all duration-500 ease-in-out origin-top transform ${
          menuOpened
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible"
        }`}
      >
        <ul className="flex flex-col gap-5">
          <li>
            <p className="text-md font-semibold">Guest</p>
          </li>
          <li
            className="flex flex-col items-start gap-2 group "
            onClick={() =>
              setIsDropdowned((prev) => ({ ...prev, blog: !prev.blog }))
            }
          >
            <span className="flex justify-center items-center gap-2 ">
              <FaBloggerB />
              <p>Blogs</p>
              <FaChevronDown />
            </span>
            {isDropdowned.blog && (
              <div
                className={`p-3 flex flex-col border-y-2 border-y-gray-600 transition-all duration-700 ease-in-out origin-top transform ${
                  isDropdowned
                    ? "opacity-100 scale-y-100 visible"
                    : "opacity-0 scale-y-0 invisible"
                }`}
              >
                <Link href={"/"}>My blog</Link>
                <Link href={"/"}>Create blog</Link>
                <Link href={"/"}>View others blog</Link>
              </div>
            )}
          </li>
          <li
            className="flex flex-col items-start gap-2 group "
            onClick={() =>
              setIsDropdowned((prev) => ({ ...prev, event: !prev.event }))
            }
          >
            <span className="flex justify-center items-center gap-2 ">
              <MdOutlineEventNote />

              <p>Event</p>
              <FaChevronDown />
            </span>
            {isDropdowned.event && (
              <div
                className={`p-3 flex flex-col border-y-2 border-y-gray-600 transition-all duration-700 ease-in-out origin-top transform ${
                  isDropdowned
                    ? "opacity-100 scale-y-100 visible"
                    : "opacity-0 scale-y-0 invisible"
                }`}
              >
                <Link className="text-gray-700 hover:text-gray-900 " href={"/"}>
                  All events
                </Link>
                <Link className="text-gray-700 hover:text-gray-900 " href={"/"}>
                  My events
                </Link>
                <Link className="text-gray-700 hover:text-gray-900 " href={"/"}>
                  Events this month
                </Link>
              </div>
            )}
          </li>
          <li>
            <Link href="/" className=" flex items-center gap-2">
              <span className="">Gallery</span>
            </Link>
          </li>
          <li>
            <Link href="/" className=" flex items-center gap-2 ">
              <FaHistory />
              <span>My Donation History</span>
            </Link>
          </li>

          <li>
            <Link href="/" className=" flex items-center gap-2 ">
              <FaUserCog />
              <span>My Profile</span>
            </Link>
          </li>
          <li>
            <a
              //   onClick={() => handleLogout({ auth, navigate })}
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2 "
            >
              <IoMdLogOut />

              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
