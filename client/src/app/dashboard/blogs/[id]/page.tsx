"use client";

import { Button } from "@/app/components/Button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Contents from "@/app/components/Contents";
import Image from "next/image";
import Title from "@/app/components/Title";
import Loader from "@/app/components/Loader";

type Blog = {
  _id: string;
  name: string;
  typeOfBlog: string;
  content: string;
  author: string[];
  tags: string[];
  publishedDate: string | null;
  isPublished: boolean;
  headerImage?: string;
};

const ViewBlog = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`);
      const data = await res.json();
      setBlog(data.blog);
    };
    fetchBlog();
  }, [id]);

  const togglePublish = async () => {
    if (!blog) return;

    const formData = new FormData();
    formData.append("name", blog.name);
    formData.append("typeOfBlog", blog.typeOfBlog);
    formData.append("content", blog.content);
    formData.append("author", JSON.stringify(blog.author));
    formData.append("tags", JSON.stringify(blog.tags));
    formData.append("isPublished", blog.isPublished ? "false" : "true");
    if (blog.headerImage) {
      formData.append("headerImage", blog.headerImage);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      setBlog((prev) =>
        prev ? { ...prev, isPublished: !prev.isPublished } : prev
      );
    }
  };

  if (!blog) return <Loader />;

  return (
    <div className="w-4/5 mt-10 m-auto flex flex-col items-start gap-5">
      {blog.headerImage && (
        <div className="w-full h-80 relative rounded-lg overflow-hidden shadow-md">
          <Image
            src={blog.headerImage}
            alt={blog.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="w-full flex justify-between items-center mt-5">
        <Title text={blog.name} />
      </div>
      <div className="flex items-center justify-between gap-5 w-full">
        <p className="font-medium text-xl text-blue-600">
          {blog.author.join(", ")}
        </p>
        <div>
          <p
            className={`${
              blog.isPublished ? "text-green-600" : "text-red-600"
            } capitalize text-lg font-semibold`}
          >
            {blog.isPublished ? "Published" : "Unpublished"}
          </p>
          <p className="text-sm text-gray-500 italic">
            {blog.publishedDate
              ? `Published on ${new Date(
                  blog.publishedDate
                ).toLocaleDateString()}`
              : "Not yet published"}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-wrap gap-2 w-3/4">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Button
          btnText={blog.isPublished ? "Unpublish" : "Publish"}
          secondary
          type="button"
          className="max-w-24"
          onClickFunction={togglePublish}
        />
      </div>

      <Contents content={blog.content} />

      <div className="flex items-center justify-between w-full mt-10">
        <Button
          type="button"
          tertiary
          btnText="Edit"
          onClickFunction={() => router.push(`/dashboard/blogs/edit/${id}`)}
        />
        <Button
          type="button"
          primary
          btnText="Go Back"
          onClickFunction={() => router.push("/dashboard/blogs")}
        />
      </div>
    </div>
  );
};

export default ViewBlog;
