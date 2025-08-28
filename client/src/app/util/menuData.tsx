import { ReactNode } from "react";
import { TfiLayoutMediaCenter } from "react-icons/tfi";
import { MdOutlineEventNote } from "react-icons/md";
import { TbPageBreak } from "react-icons/tb";
export type MenuItem = {
  id: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: MenuItem[];
};
type ApiPage = {
  id: string;
  title: string;
  slug?: string;
  children?: ApiPage[];
};

// --- Hardcoded menus ---
const staticMenus: MenuItem[] = [
  {
    id: "media",
    title: "Media",
    icon: <TfiLayoutMediaCenter className="w-5 h-5" />,
    children: [
      { id: "blogs", title: "Blogs", href: "/blogs" },
      { id: "gallery", title: "Gallery", href: "/gallery" },
      { id: "documents", title: "Download Docs", href: "/documents" },
    ],
  },
  {
    id: "event",
    title: "Event",
    icon: <MdOutlineEventNote className="w-5 h-5" />,
    children: [
      { id: "all", title: "All Events", href: "/events" },
      { id: "month", title: "This Month", href: "/events/view/month" },
      {
        id: "registered",
        title: "Registered",
        href: "/events/view/registered",
      },
    ],
  },
];

function transformPagesToMenu(pages: ApiPage[]): MenuItem[] {
  return pages.map((page) => ({
    id: page.slug || page.id,
    title: page.title,
    href: page.slug ? `/slug/${page.slug}` : undefined,
    children: page.children ? transformPagesToMenu(page.children) : [],
  }));
}

// --- Fetch dynamic pages ---
export async function getDynamicMenu(): Promise<MenuItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return staticMenus;

  const data = await res.json();

  const dynamicPages: MenuItem = {
    id: "pages",
    title: "Pages",
    icon: <TbPageBreak className="w-5 h-5" />,
    children: transformPagesToMenu(data.pages || []),
  };

  return [...staticMenus, dynamicPages];
}
