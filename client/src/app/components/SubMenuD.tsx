"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { menuData, MenuItem } from "../util/menuData";

type SubMenuProps = {
  items: MenuItem[];
  level?: number;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
};

const SubMenuD = ({
  items,
  level = 0,
  openMenuId,
  setOpenMenuId,
}: SubMenuProps) => {
  const pathname = usePathname();

  useEffect(() => setOpenMenuId(null), [pathname, setOpenMenuId]);

  return (
    <ul
      className={`flex flex-col sm:flex-row gap-5 ${
        level > 0 ? "pl-4 sm:pl-0" : ""
      }`}
    >
      {items.map((item) => {
        const hasChildren = !!item.children?.length;
        const isOpen = openMenuId === item.id;

        return (
          <li
            key={item.id}
            className={`relative w-full sm:w-auto ${
              level > 0 ? "sm:static" : ""
            }`}
          >
            {hasChildren ? (
              <>
                {/* header button */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenuId(isOpen ? null : item.id)}
                  className="flex gap-2 items-center w-full group"
                >
                  <div className="flex sm:flex-col gap-1 items-center">
                    {item.icon}
                    <p className="text-sm font-light group-hover:font-semibold">
                      {item.title}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* submenu */}
                <div
                  className={`overflow-y-scroll transition-all duration-500 ease-in-out
                    ${
                      isOpen
                        ? "max-h-96 opacity-100 sm:scale-y-100 sm:visible"
                        : "max-h-0 opacity-0 sm:scale-y-0 sm:invisible"
                    }
                    sm:absolute sm:top-full sm:right-0 sm:w-48
                    w-full bg-gray-200 sm:bg-gray-200 sm:shadow-lg
                    sm:rounded-none rounded-lg sm:transform sm:origin-top`}
                >
                  <div className="p-5 sm:p-3">
                    <SubMenuD
                      items={item.children!}
                      level={level + 1}
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                    />
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={item.href || "/"}
                onClick={() => setOpenMenuId(null)}
                className="flex sm:flex-col justify-between items-center w-full group p-2 hover:font-semibold"
              >
                <div className="flex sm:flex-col gap-3 items-center">
                  {item.icon}
                  <p className="text-sm font-light group-hover:font-semibold">
                    {item.title}
                  </p>
                </div>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default function MenuWrapper() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <SubMenuD
      items={menuData}
      openMenuId={openMenuId}
      setOpenMenuId={setOpenMenuId}
    />
  );
}
