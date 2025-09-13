"use client";

import { Button } from "@/app/components/Button";
import Contents from "@/app/components/Contents";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type ParentPage = {
  _id: string;
  title: string;
  slug: string;
};

type Page = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  parent?: ParentPage | null;
};

const Pages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAllPages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`
        );
        const data = await res.json();
        setPages(data.pages || []);
      } catch (err) {
        console.error("Error fetching pages:", err);
      }
    };
    fetchAllPages();
    setLoading(false);
  }, []);

  const onNewClick = () => {
    router.push("/dashboard/pages/create");
  };

  const onViewClick = (id: string) => {
    router.push(`/dashboard/pages/${id}`);
  };

  const onEditClick = (id: string) => {
    router.push(`/dashboard/pages/edit/${id}`);
  };

  const onPublishToggle = async (page: Page) => {
    const formData = new FormData();
    formData.append("title", page.title);
    formData.append("slug", page.slug);
    formData.append("isPublished", String(!page.isPublished));
    formData.append("parent", page.parent?._id || "");
    formData.append("content", page.content);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAGES_API_URL}/${page._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (res.ok) {
        setPages((prev) =>
          prev.map((p) =>
            p._id === page._id ? { ...p, isPublished: !p.isPublished } : p
          )
        );
      }
    } catch (err) {
      console.error("Error toggling publish:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center">
        <Title text="All Pages" />
        <Button
          type="button"
          btnText="New Page"
          secondary={true}
          onClickFunction={onNewClick}
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
                {page.parent?.title || "-"}
              </td>
              <td className="border px-4 py-2 max-w-48">
                <Contents shortened content={page.content} />
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
                  onClickFunction={() => onPublishToggle(page)}
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
