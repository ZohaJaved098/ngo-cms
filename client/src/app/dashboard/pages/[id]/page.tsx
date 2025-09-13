"use client";

import { Button } from "@/app/components/Button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Contents from "@/app/components/Contents";
import Image from "next/image";
import Title from "@/app/components/Title";

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
  bannerImage?: string;
  parent?: ParentPage | null;
};

const ViewPage = () => {
  const [page, setPage] = useState<Page | null>(null);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  // Fetch single page
  useEffect(() => {
    const fetchAPage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`
        );
        const data = await res.json();
        setPage(data.page);
      } catch (err) {
        console.error("Error fetching page:", err);
      }
    };
    fetchAPage();
  }, [id]);

  // Edit navigation
  const onEditClick = (id: string) => {
    router.push(`/dashboard/pages/edit/${id}`);
  };

  // Back to list
  const onCancelClick = () => {
    router.push(`/dashboard/pages`);
  };

  // Toggle publish/unpublish
  const onPublishToggle = async () => {
    if (!page) return;

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
        setPage((prev) =>
          prev ? { ...prev, isPublished: !prev.isPublished } : prev
        );
      }
    } catch (err) {
      console.error("Error toggling publish:", err);
    }
  };

  if (!page) {
    return (
      <div className="mt-10 w-4/5 mx-auto">
        <h1 className="text-red-500">
          Page not found! Go back to
          <span
            className="underline text-blue-500 cursor-pointer"
            onClick={() => router.push("/dashboard/pages")}
          >
            Pages
          </span>
        </h1>
      </div>
    );
  }

  return (
    <div className="w-4/5 mt-10 m-auto flex flex-col items-start gap-5">
      {page.bannerImage && (
        <div className="w-full h-80 relative rounded-lg overflow-hidden shadow-md">
          <Image
            src={page.bannerImage}
            alt={page.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="w-full flex justify-between items-center">
        <Title text={page.title} />

        <p className="font-light text-lg text-gray-500">{page.slug}</p>
      </div>

      <p className="text-sm text-gray-600">
        Parent: {page.parent?.title || "—"}
      </p>

      <div className="flex items-center justify-between w-full ">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            page.isPublished
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {page.isPublished ? "Published" : "Unpublished"}
        </span>

        <Button
          btnText={page.isPublished ? "Unpublish" : "Publish"}
          secondary={true}
          type="button"
          onClickFunction={onPublishToggle}
        />
      </div>

      <Contents content={page.content} />

      <div className="flex items-center justify-between w-full">
        <Button
          type="button"
          tertiary={true}
          btnText="Edit"
          onClickFunction={() => onEditClick(page._id)}
        />
        <Button
          type="button"
          primary={true}
          btnText="Go Back"
          onClickFunction={onCancelClick}
        />
      </div>
    </div>
  );
};

export default ViewPage;
