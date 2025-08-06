"use client";

import { Button } from "@/app/components/Button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Blogs = {
  _id: string;
  name: string;
  typeOfBlog: string;
  content: string;
  author: string[];
  tags: string[];
  publishedDate: string | null;
  isPublished: boolean;
};

const ViewBlog = () => {
  const [blog, setBlog] = useState<Blogs | null>(null);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    const fetchABlog = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`);
      const data = await res.json();
      setBlog(data.blog);
    };
    fetchABlog();
  }, [id]);

  const onEditClick = (id: string) => {
    router.push(`edit/${id}`);
  };

  const onCancelClick = () => {
    router.push(`/dashboard/blogs`);
  };

  const onPublishToggle = async () => {
    if (!blog) return;

    const payload = {
      ...blog,
      isPublished: !blog.isPublished,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setBlog((prev) =>
        prev ? { ...prev, isPublished: !prev.isPublished } : prev
      );
    }
  };

  return blog == null ? (
    <div className="">
      <h1>Not found! Go back to /dashboard/blogs</h1>
    </div>
  ) : (
    <div className="w-4/5 mt-10 m-auto flex flex-col items-start gap-5">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold text-3xl tracking-wider">{blog.name}</h1>
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
          secondary={true}
          type="button"
          className="max-w-24"
          onClickFunction={onPublishToggle}
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg w-full mt-5"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Actions */}
      <div className="flex items-center justify-between w-full mt-10">
        <Button
          type="button"
          tertiary={true}
          btnText="Edit"
          className="max-w-32"
          onClickFunction={() => onEditClick(blog._id)}
        />
        <Button
          type="button"
          primary={true}
          btnText="Go Back"
          className="max-w-32"
          onClickFunction={onCancelClick}
        />
      </div>
    </div>
  );
};

export default ViewBlog;
