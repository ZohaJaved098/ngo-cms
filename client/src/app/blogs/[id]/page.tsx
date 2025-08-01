"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Blog = {
  _id: string;
  name: string;
  typeOfBlog: string;
  content: string;
  author: string[];
  tags: string[];
  publishedDate: string | null;
  isPublished: boolean;
};

const BlogDetailPage = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`);
      const data = await res.json();
      setBlog(data.blog);
    };

    if (id) fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center mt-20">Loading blog...</p>;
  if (!blog.isPublished)
    return (
      <p className="text-center mt-20">🚫 This blog is not published yet.</p>
    );

  return (
    <div className="w-4/5 mx-auto mt-40 my-10 flex flex-col gap-6">
      <h1 className="text-4xl font-bold">{blog.name}</h1>
      <p className="text-gray-600 text-sm italic">
        {blog.publishedDate &&
          `Published on ${new Date(
            blog.publishedDate
          ).toLocaleDateString()}`}{" "}
        by {blog.author.join(", ")}
      </p>

      <div className="flex flex-wrap gap-2">
        {blog.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      <hr className="border-gray-300" />

      <div
        className="prose prose-lg max-w-full"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogDetailPage;
