import { ReactNode } from "react";
import { TfiLayoutMediaCenter } from "react-icons/tfi";
import { MdOutlineEventNote } from "react-icons/md";

export type MenuItem = {
  id: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: MenuItem[];
};

export const menuData: MenuItem[] = [
  {
    id: "media",
    title: "Media",
    icon: <TfiLayoutMediaCenter className="w-5 h-5" />,
    children: [
      { id: "blogs", title: "Blogs", href: "/blogs" },
      { id: "gallery", title: "Gallery", href: "/" },
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
        children: [
          {
            id: "attending",
            title: "Attending",
            href: "/events/view/registered/attending",
          },
          {
            id: "not-attending",
            title: "Not Attending",
            href: "/events/view/registered/not-attending",
          },
        ],
      },
    ],
  },
];
