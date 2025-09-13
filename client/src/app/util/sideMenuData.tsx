import { FaRegImages } from "react-icons/fa";
import { FaRegRectangleList } from "react-icons/fa6";
import { GrDocumentUpload, GrGallery } from "react-icons/gr";
import { MdOutlineEvent } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import { BiDonateBlood } from "react-icons/bi";
import { FaPeopleCarry } from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import { LuHandHelping } from "react-icons/lu";
export const SideMenuData = [
  {
    id: "content",
    title: "Contents",
    links: [
      {
        name: "Pages",
        icon: <RiPagesLine className="w-5 h-5" />,
        link: "pages",
      },
      {
        name: "Blogs",
        icon: <FaRegRectangleList className="w-5 h-5" />,
        link: "blogs",
      },
      {
        name: "Events",
        icon: <MdOutlineEvent className="w-5 h-5" />,
        link: "events",
      },
    ],
  },
  {
    id: "media",
    title: "Media Library",
    links: [
      {
        name: "Image Sliders",
        icon: <FaRegImages className="w-5 h-5" />,
        link: "image-sliders",
      },
      {
        name: "Gallery",
        icon: <GrGallery className="w-5 h-5" />,
        link: "gallery",
      },
      {
        name: "Documents",
        icon: <GrDocumentUpload className="w-5 h-5" />,
        link: "documents",
      },
    ],
  },
  {
    id: "donation",
    title: "Donations",
    links: [
      {
        name: "Donate Informations",
        icon: <BiDonateBlood className="w-5 h-5" />,
        link: "donate",
      },
    ],
  },
  {
    id: "people",
    title: "People",
    links: [
      {
        name: "Overall",
        icon: <FaPeopleLine className="w-5 h-5" />,
        link: "people",
      },
      {
        name: "Our Team",
        icon: <FaPeopleCarry className="w-5 h-5" />,
        link: "people/teams",
      },
      {
        name: "Our Contacts",
        icon: <BiSolidContact className="w-5 h-5" />,
        link: "people/contact",
      },
      {
        name: "Volunteers",
        icon: <LuHandHelping className="w-5 h-5" />,
        link: "people/volunteers",
      },
    ],
  },
];
