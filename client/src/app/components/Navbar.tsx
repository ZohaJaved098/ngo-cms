// "use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/app/assets/Logo.png";
import { LiaDonateSolid } from "react-icons/lia";
import {
  // FaChevronDown,
  FaRegUserCircle,
} from "react-icons/fa";

import Menu from "./Menu";
// import { useState } from "react";

const Navbar = () => {
  //   const [isDropdowned, setIsDropdowned] = useState({
  //     blog: false,
  //     event: false,
  //   });
  //   const [menuOpened, setMenuOpened] = useState(false);
  return (
    <div className="fixed top-0 right-0 z-50 min-h-32 max-h-full transition-all w-screen flex flex-col bg-white items-center shadow-lg">
      <div className="flex justify-between items-center h-full w-full py-2 px-4 md:px-10 bg-blue-500 border-b-2 border-b-gray-600">
        <p>zohajaved.098@gmail.com</p>
        <p>Contact Information</p>
      </div>
      <div className="flex items-center justify-between h-full w-full px-4 md:px-10 my-2">
        {/* demo logo */}
        <Image src={Logo} alt="logo" width={70} height={70} />
        {/* <div
          className={`${
            menuOpened ? "flex h-screen" : "hidden"
          } md:flex flex-col`}
        >
          <ol
            className={`${
              menuOpened ? "flex-col h-screen" : "flex-row"
            } flex items-center justify-evenly gap-5 transition-all delay-700`}
          >
            <li
              className="flex items-center gap-2 group "
              onClick={() =>
                setIsDropdowned((prev) => ({ ...prev, blog: !prev.blog }))
              }
            >
              <p className=" font-light group-hover:font-semibold group-hover:text-lg transition-all">
                Blogs
              </p>
              <FaChevronDown />
            </li>

            <li
              className="flex items-center gap-2 group "
              onClick={() =>
                setIsDropdowned((prev) => ({ ...prev, event: !prev.event }))
              }
            >
              <p className=" font-light group-hover:font-semibold group-hover:text-lg transition-all">
                Events
              </p>
              <FaChevronDown />
            </li>
            <li className="flex items-center gap-2 group ">
              <Link
                href={"/"}
                className=" font-light group-hover:font-semibold group-hover:text-lg transition-all"
              >
                Gallery
              </Link>
            </li>
            <li className="flex items-center gap-2 group ">
              <Link
                href={"/"}
                className=" font-light group-hover:font-semibold group-hover:text-lg transition-all"
              >
                Volunteers
              </Link>
            </li>
            <li className="flex items-center gap-2 group ">
              <Link
                href={"/"}
                className=" font-light group-hover:font-semibold group-hover:text-lg transition-all"
              >
                Our Team
              </Link>
            </li>
          </ol>
          <div className="flex items-center justify-evenly gap-5 transition-all delay-700 ">
            {isDropdowned.blog && (
              <div className="bg-gray-400 shadow-lg p-3 border-t-2 border-t-gray-600 ">
                <li>My blog</li>
                <li>Create blog</li>
                <li>View others blog</li>
              </div>
            )}
            {isDropdowned.event && (
              <div className="bg-gray-400 shadow-lg p-3 border-t-2 border-t-gray-600 ">
                <li>All events</li>
                <li>Events this months</li>
                <li>Events I`&apos;`m going to</li>
              </div>
            )}
          </div>
        </div> */}

        <div className="flex gap-5 items-center">
          <span className="flex flex-col items-center group ">
            <LiaDonateSolid
              title="Donate"
              className="w-5 h-5 group-hover:w-7 group-hover:h-7 transition-all"
            />
            <p className="hidden md:block text-sm font-light group-hover:font-semibold">
              Donate
            </p>
          </span>
          <Link href={"/login"} className="flex flex-col items-center group">
            <FaRegUserCircle
              title="Login"
              className="w-5 h-5 group-hover:w-7 group-hover:h-7 transition-all"
            />
            <p className="hidden md:block text-sm font-light group-hover:font-semibold ">
              Login
            </p>
          </Link>
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
