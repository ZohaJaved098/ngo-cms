"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BLOGS_API_URL}/all-blogs`
      );
      const data = await res.json();

      const publishedOnly = data.blogs.filter((blog: Blog) => blog.isPublished);
      setBlogs(publishedOnly);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="w-11/12 mx-auto mt-40 flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-center">📚 Our Blogs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
        {blogs.length === 0 ? (
          <p className="text-center col-span-full">No published blogs yet!</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="border p-5 rounded-xl shadow-lg flex flex-col gap-3 w-full h-[320px] bg-white hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <Link
                href={`/blogs/${blog._id}`}
                className="text-xl font-semibold text-blue-700 hover:underline line-clamp-2"
              >
                {blog.name}
              </Link>

              <p className="text-sm text-gray-600 italic">
                {blog.publishedDate &&
                  `Published on ${new Date(
                    blog.publishedDate
                  ).toLocaleDateString()}`}{" "}
                | By {blog.author.join(", ")}
              </p>

              <div
                className="text-gray-700 text-sm line-clamp-4 flex-grow"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <div className="flex flex-wrap gap-2 mt-auto">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicBlogs;
