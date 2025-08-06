"use client";
import Link from "next/link";
import React from "react";
import { FaBloggerB } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";

type SubMenuProps = {
  menuType: "media" | "event";
  isOpen: boolean;
  // className: string;
};

const SubMenu: React.FC<SubMenuProps> = ({ menuType, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full sm:min-w-[200px] sm:max-w-[250px] sm:absolute sm:top-full sm:left-0 mt-2 bg-white border-2 border-gray-500 rounded-md p-3 shadow-lg z-[999]">
      {menuType === "media" && (
        <div className="flex flex-col gap-3">
          <Link
            href="/blogs"
            className=" flex gap-5 text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            <FaBloggerB className=" w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
            Blogs
          </Link>
          <Link
            href="/"
            className=" flex gap-5 text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            <GrGallery className=" w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all" />
            Gallery
          </Link>
          {/* <Link
            href="/"
            className=" flex gap-5 text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            View others blog
          </Link> */}
        </div>
      )}

      {menuType === "event" && (
        <div className="flex flex-col gap-3">
          <Link
            href="/events"
            className=" flex gap-5 text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            All Events
          </Link>
          <Link
            href="/"
            className=" flex gap-5 text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            Events this Month
          </Link>
          <Link
            href="/"
            className=" flex gap-5 text-sm text-gray-700 hover:text-gray-900 hover:underline "
          >
            Events I&apos;m going to
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubMenu;
