"use client";
import { Button } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Page = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
};

const Pages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const router = useRouter();
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

  const onNewClick = () => {
    router.push(`pages/create`);
  };
  const onViewClick = (id: string) => {
    router.push(`pages/${id}`);
  };
  const onEditClick = (id: string) => {
    router.push(`pages/edit/${id}`);
  };
  const onPublishToggle = () => {
    console.log("Publish button is Clicked");
  };

  return (
    <div className="flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Pages</h3>
        <Button
          type="button"
          btnText="New Page"
          secondary={true}
          onClickFunction={onNewClick}
          className="max-w-40"
        />
      </div>
      <table className="w-full table-auto border border-gray-300 text-sm text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Slug</th>
            <th className="border border-gray-300 px-4 py-2">Parent/Child</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">View</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
            <th className="border border-gray-300 px-4 py-2">Toggle Status</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                {page.title}
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                {page.slug}
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">/</td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                <p
                  className="line-clamp-2 max-w-48"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                ></p>
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 text-red-500 capitalize ">
                {page.status}
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="View"
                  secondary={true}
                  onClickFunction={() => onViewClick(page._id)}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="Edit"
                  tertiary={true}
                  onClickFunction={() => onEditClick(page._id)}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="Publish"
                  primary={true}
                  onClickFunction={onPublishToggle}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pages;
