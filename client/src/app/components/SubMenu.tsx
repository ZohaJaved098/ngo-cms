"use client";
import Link from "next/link";
import React from "react";

type SubMenuProps = {
  menuType: "blog" | "event";
  isOpen: boolean;
  // className: string;
};

const SubMenu: React.FC<SubMenuProps> = ({ menuType, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full sm:min-w-[200px] sm:max-w-[250px] sm:absolute sm:top-full sm:left-0 mt-2 bg-white border-2 border-gray-500 rounded-md p-3 shadow-lg z-[999]">
      {menuType === "blog" && (
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className=" text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            My blog
          </Link>
          <Link
            href="/"
            className=" text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            Create blog
          </Link>
          <Link
            href="/"
            className=" text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            View others blog
          </Link>
        </div>
      )}

      {menuType === "event" && (
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className=" text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            All Events
          </Link>
          <Link
            href="/"
            className=" text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            Events this Month
          </Link>
          <Link
            href="/"
            className=" text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            Events I&apos;m going to
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubMenu;
