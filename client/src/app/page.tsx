"use client";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useState, useEffect } from "react";

type Page = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
};
export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [pages, setPages] = useState<Page[]>([]);
  useEffect(() => {
    const fetchAllPages = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`
      );
      const data = await res.json();

      setPages(data.pages);
    };
    fetchAllPages();
  }, []);
  return (
    <div className="h-screen mt-32">
      <h1 className="text-purple-600 text-3xl">Hello {user.username}</h1>
      {pages.map((page) => (
        <div key={page._id}>
          <div className=" w-full flex justify-between items-center">
            <h1 className="font-black text-3xl">{page.title}</h1>
            <p className="font-light text-xl underline">{page.slug}</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      ))}
    </div>
  );
}
