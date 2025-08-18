"use client";

import Image from "next/image";
import Logo from "@/app/assets/Logo.png";
import { LiaDonateSolid } from "react-icons/lia";

import Menu from "./Menu";
import Avatar from "./Avatar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <div className="fixed top-0 right-0 z-20 min-h-32 max-h-full transition-all w-screen flex flex-col bg-white items-center shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center min-h-5 h-full w-full py-2 px-4 sm:px-10 bg-blue-500 border-b-2 border-b-gray-600">
        <p className="text-sm ">zohajaved.098@gmail.com</p>
        <p className="text-sm ">Contact Information</p>
      </div>
      <div className="flex items-center justify-between max-h-[100px] w-full px-4 sm:px-10 my-2">
        {/* demo logo */}
        <Link href={"/"}>
          <Image src={Logo} alt="logo" width={70} height={70} />
        </Link>

        <div className="flex gap-5 items-center">
          <Menu />
          <span className="flex flex-col items-center group cursor-pointer ">
            <LiaDonateSolid
              title="Donate"
              className="w-5 h-5 group-hover:w-7 group-hover:h-7 transition-all"
            />
            <p className="hidden sm:block text-sm font-light group-hover:font-semibold">
              Donate
            </p>
          </span>
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
