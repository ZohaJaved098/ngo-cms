"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiDashboard } from "react-icons/tfi";
import SubMenuD from "./SubMenuD";

const BREAKPOINT_PX = 640; // Tailwind 'sm' breakpoint

export default function Menu() {
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();

  const [menuOpened, setMenuOpened] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // keep isDesktop in sync with Tailwind's sm breakpoint
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${BREAKPOINT_PX}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // when switching modes: desktop -> open, mobile -> closed
  useEffect(() => {
    setMenuOpened(isDesktop);
  }, [isDesktop]);

  // on route change: only auto-close on mobile
  useEffect(() => {
    if (!isDesktop) setMenuOpened(false);
  }, [pathname, isDesktop]);

  return (
    <div className="flex">
      {/* Mobile toggle */}
      <span
        className="flex sm:hidden flex-col items-center group relative cursor-pointer"
        onClick={() => setMenuOpened((v) => !v)}
      >
        <RxHamburgerMenu
          title="menu"
          className="w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all"
        />
      </span>

      {/* Menu list container */}
      <div
        className={[
          // mobile show/hide
          menuOpened
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible",
          // force visible on desktop regardless of state
          "sm:opacity-100 sm:scale-y-100 sm:visible",
          "overflow-y-auto sm:overflow-visible absolute top-full right-0 sm:static sm:top-0 sm:right-0",
          "w-full sm:w-auto max-h-[80vh] p-5 sm:p-0",
          "shadow-lg sm:shadow-none bg-gray-200 sm:bg-transparent",
          "transition-all duration-500 ease-in-out origin-top transform",
        ].join(" ")}
      >
        <ul className="flex sm:flex-row flex-col gap-5 sm:justify-center sm:items-start mx-auto">
          <SubMenuD />
          {(user.role === "admin" || user.role === "manager") && (
            <li className="group cursor-pointer">
              <Link
                href="/dashboard"
                className="flex sm:flex-col sm:gap-0 gap-3 items-center "
              >
                <TfiDashboard className="w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
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
}
