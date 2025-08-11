"use client";

import { Button } from "@/app/components/Button";
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

const Blogs = () => {
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
    const updatedStatus = !blog.isPublished;

    const payload = {
      ...blog,
      isPublished: updatedStatus,
    };

    await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${blog._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    fetchAllBlogs();
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
        <h3 className="text-xl font-semibold">All Blogs</h3>
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
                  <p
                    className="line-clamp-2 max-w-48 prose-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  ></p>
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                  <ul>
                    {blog.author.map((a, i) => (
                      <li key={i}>{a};</li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-40 ">
                  <ul className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, i) => (
                      <li
                        key={i}
                        className="bg-cyan-600 text-white rounded-2xl py-2 px-3"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
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
