"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;

  activeClassName?: string;
  className?: string;
};

const ActiveLink: React.FC<ActiveLinkProps> = ({
  href,
  children,
  activeClassName = "bg-blue-500 font-semibold",
  className = "",
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : ""}`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
