"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getDynamicMenu, MenuItem } from "../util/menuData";

type SubMenuProps = {
  items: MenuItem[];
  level?: number;
};

const SubMenu = ({ items, level = 0 }: SubMenuProps) => {
  const pathname = usePathname();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isNested = useMemo(() => level > 0, [level]);

  useEffect(() => {
    if (isNested) {
      setOpenMenuId(null);
    }
  }, [pathname, isNested]);

  return (
    <ul
      className={`flex gap-2 sm:gap-5 ${
        level === 0 ? "sm:flex-row flex-col" : "flex-col"
      }`}
    >
      {items.map((item) => {
        const hasChildren = !!item.children?.length;
        const isOpen = openMenuId === item.id;

        return (
          <li key={item.id} className="relative w-full sm:w-auto">
            {hasChildren ? (
              <>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`submenu-${item.id}`}
                  onClick={() => setOpenMenuId(isOpen ? null : item.id)}
                  className="flex justify-between sm:justify-start items-center w-full group"
                >
                  <div className="flex sm:flex-col gap-2 items-center">
                    {item.icon}
                    <p className="text-sm font-light group-hover:font-semibold">
                      {item.title}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`ml-2 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`submenu-${item.id}`}
                  className={[
                    "transition-all ease-out overflow-hidden p-3",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                    "duration-300",
                    level === 0
                      ? "sm:absolute sm:top-full sm:left-0 sm:min-w-48 sm:opacity-100 sm:translate-y-0 sm:duration-200 sm:ease-out"
                      : "",
                    isOpen
                      ? "sm:visible"
                      : "sm:invisible sm:opacity-0 sm:translate-y-2",
                    "w-full bg-gray-200 sm:bg-white sm:shadow-lg sm:border sm:border-gray-200 sm:z-50",
                  ].join(" ")}
                >
                  <div className="p-2">
                    <SubMenu items={item.children!} level={level + 1} />
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={item.href || "/"}
                onClick={() => {
                  if (isNested) setOpenMenuId(null);
                }}
                className="flex gap-2 items-center group hover:font-semibold"
              >
                {item.icon}
                <p className="text-sm font-light group-hover:font-semibold">
                  {item.title}
                </p>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default function MenuWrapper() {
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function loadMenu() {
      const data = await getDynamicMenu();
      setMenus(data);
    }
    loadMenu();
  }, []);

  if (menus.length === 0) {
    return <div className="p-4 text-gray-500">Loading menu...</div>;
  }

  return <SubMenu items={menus} />;
}
