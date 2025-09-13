"use client";

import { Button } from "@/app/components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Contents from "@/app/components/Contents";
import Title from "@/app/components/Title";

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

const Blogs = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<Blogs[]>([]);

  const router = useRouter();
  const fetchAllBlogs = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BLOGS_API_URL}/all-blogs`
    );
    const data = await res.json();

    setBlogs(data.blogs);
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const onNewClick = () => {
    router.push(`blogs/create`);
  };
  const onViewClick = (id: string) => {
    router.push(`blogs/${id}`);
  };
  const onEditClick = (id: string) => {
    router.push(`blogs/edit/${id}`);
  };
  const handlePublishToggle = async (blog: Blogs) => {
    setLoading(true);
    const updatedStatus = !blog.isPublished;

    const formDataToSend = new FormData();
    formDataToSend.append("name", blog.name);
    formDataToSend.append("typeOfBlog", blog.typeOfBlog);
    formDataToSend.append("content", blog.content);
    formDataToSend.append("author", JSON.stringify(blog.author));
    formDataToSend.append("tags", JSON.stringify(blog.tags));
    formDataToSend.append("isPublished", updatedStatus ? "true" : "false");

    await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${blog._id}`, {
      method: "PUT",
      body: formDataToSend,
      credentials: "include",
    });

    fetchAllBlogs();
    setLoading(false);
  };

  const onDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchAllBlogs();
  };
  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5 ">
        <Title text="All Blogs" />
        <Button
          type="button"
          btnText="Add new Blog"
          secondary={true}
          onClickFunction={onNewClick}
          className="max-w-40"
        />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10 rounded-md">
            <tr className="bg-gray-300">
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Content
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Author
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Tags
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Published on
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Edit
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Publish
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="max-h-60">
                <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                  {blog.name}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                  {blog.typeOfBlog}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                  <Contents shortened={true} content={blog.content} />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                  {blog.author.join(", ")}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-40 ">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-cyan-600 text-white rounded-2xl py-1 px-3 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                  {blog.publishedDate
                    ? new Date(blog.publishedDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="View"
                    secondary={true}
                    onClickFunction={() => onViewClick(blog._id)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="Edit"
                    tertiary={true}
                    onClickFunction={() => onEditClick(blog._id)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-40">
                  <Button
                    type="button"
                    btnText={blog.isPublished ? "Unpublish" : "Publish"}
                    primary={true}
                    loading={loading}
                    onClickFunction={() => handlePublishToggle(blog)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="Delete"
                    primary={true}
                    onClickFunction={() => onDelete(blog._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
