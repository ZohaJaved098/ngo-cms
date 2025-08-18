"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname } from "next/navigation";

import { RxHamburgerMenu } from "react-icons/rx";
// import { FaChevronDown } from "react-icons/fa";
// import { MdOutlineEventNote } from "react-icons/md";
// import { TfiLayoutMediaCenter } from "react-icons/tfi";
import { TfiDashboard } from "react-icons/tfi";

// import SubMenu from "./SubMenu";
import SubMenuD from "./SubMenuD";
const Menu = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [menuOpened, setMenuOpened] = useState(false);
  // const [subMenu, setSubMenu] = useState<"media" | "event" | null>(null);
  const pathname = usePathname();

  // Close menu whenever route changes
  useEffect(() => {
    setMenuOpened(false);
  }, [pathname]);

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
        className="flex sm:hidden flex-col items-center group relative cursor-pointer"
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
        } overflow-y-auto sm:overflow-visible absolute top-full right-0 sm:static sm:top-0 sm:right-0 w-full sm:w-auto max-h-[80vh] p-5 sm:p-0 shadow-lg sm:shadow-none bg-gray-200 sm:bg-transparent transition-all duration-500 ease-in-out origin-top transform`}
      >
        <ul className="flex sm:flex-row flex-col gap-5 sm:justify-center sm:items-start mx-auto">
          <SubMenuD />
          {(user.role === "admin" || user.role === "manager") && (
            <li className="group cursor-pointer">
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
