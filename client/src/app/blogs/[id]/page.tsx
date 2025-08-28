"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RelevantLinks from "@/app/components/RelevantLinks";
import Contents from "@/app/components/Contents";
import Image from "next/image";

type Blog = {
  _id: string;
  name: string;
  typeOfBlog: string;
  headerImage: string | null;
  content: string;
  author: string[];
  tags: string[];
  publishedDate: string | null;
  isPublished: boolean;
};

const BlogDetailPage = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlogAndRelated = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`);
      const data = await res.json();
      setBlog(data.blog);

      const allRes = await fetch(
        `${process.env.NEXT_PUBLIC_BLOGS_API_URL}/all-blogs`
      );
      const allData = await allRes.json();

      const related = allData.blogs
        .filter((b: Blog) => b._id !== id && b.isPublished)
        .slice(0, 4);

      setRelatedBlogs(related);
    };

    if (id) fetchBlogAndRelated();
  }, [id]);

  if (!blog) return <p className="text-center mt-20">Loading blog...</p>;
  if (!blog.isPublished)
    return (
      <p className="text-center mt-20">🚫 This blog is not published yet.</p>
    );

  return (
    <div className="flex justify-center gap-10 mt-40 p-4 mx-auto items-start w-11/12">
      {/* Main blog content */}
      <div className="w-4/5 flex flex-col gap-6">
        <Image
          src={blog.headerImage || ""}
          alt="Blog Header"
          className="rounded w-full"
          width={800}
          height={600}
        />
        <h1 className="text-4xl capitalize tracking-wider font-bold w-full">
          {blog.name}
        </h1>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-3 text-sm text-gray-600">
            <p className="font-semibold">{blog.author.join(", ")}</p>|
            <p>
              {blog.publishedDate &&
                new Date(blog.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </span>

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
        </div>

        <hr className="border-gray-300" />
        <Contents content={blog.content} />
      </div>

      {/* Relevant rightbar */}
      <RelevantLinks
        heading="Relevant Blogs"
        items={relatedBlogs.map((b) => ({
          _id: b._id,
          name: b.name,
          type: "blog",
        }))}
      />
    </div>
  );
};

export default BlogDetailPage;
