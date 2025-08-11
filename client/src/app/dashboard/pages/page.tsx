"use client";
import { Button } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Page = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  parent?: string;
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
    router.push("pages/create");
  };

  const onViewClick = (id: string) => {
    router.push(`pages/${id}`);
  };

  const onEditClick = (id: string) => {
    router.push(`pages/edit/${id}`);
  };

  const onPublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !currentStatus }),
        }
      );
      const data = await res.json();
      console.log("data from page", data);
      if (res.ok) {
        setPages((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isPublished: !currentStatus } : p
          )
        );
      }
    } catch (err) {
      console.error("Error toggling publish:", err);
    }
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
            <th className="border border-gray-300 px-4 py-2">Parent</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">View</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
            <th className="border border-gray-300 px-4 py-2">Toggle</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td className="border px-4 py-2 max-w-28 capitalize">
                {page.title}
              </td>
              <td className="border px-4 py-2 max-w-28">{page.slug}</td>
              <td className="border px-4 py-2 max-w-28">
                {page.parent || "-"}
              </td>
              <td className="border px-4 py-2 max-w-48">
                <p
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                ></p>
              </td>
              <td className="border px-4 py-2 max-w-28">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    page.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {page.isPublished ? "Published" : "Unpublished"}
                </span>
              </td>
              <td className="border px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="View"
                  secondary={true}
                  onClickFunction={() => onViewClick(page._id)}
                />
              </td>
              <td className="border px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="Edit"
                  tertiary={true}
                  onClickFunction={() => onEditClick(page._id)}
                />
              </td>
              <td className="border px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText={page.isPublished ? "Unpublish" : "Publish"}
                  primary={true}
                  onClickFunction={() =>
                    onPublishToggle(page._id, page.isPublished)
                  }
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
