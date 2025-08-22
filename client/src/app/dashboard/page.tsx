"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";

type User = { username: string; email: string };
type Page = { title: string; slug: string; content: string };
type Event = { title: string; date: string };
type Blog = {
  name: string;
  content: string;
  author: string;
  isPublished: boolean;
};

export default function Dashboard() {
  const [data, setData] = useState<{
    users: User[];
    pages: Page[];
    events: Event[];
    blogs: Blog[];
  } | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [usersRes, pagesRes, eventsRes, blogsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/admin/all-users`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`),
          fetch(`${process.env.NEXT_PUBLIC_EVENTS_API_URL}/all-events`),
          fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/all-blogs`),
        ]);

        if (!usersRes.ok || !pagesRes.ok || !eventsRes.ok || !blogsRes.ok) {
          throw new Error("Failed to fetch some dashboard data");
        }

        const usersData = await usersRes.json();
        const pagesData = await pagesRes.json();
        const eventsData = await eventsRes.json();
        const blogsData = await blogsRes.json();

        setData({
          users: usersData.users,
          pages: pagesData.pages,
          events: eventsData.events,
          blogs: blogsData.blogs,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    }

    fetchDashboardData();
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="w-full h-full flex flex-col items-center gap-10 p-5">
      <h2 className="text-4xl font-bold mb-5">DashBoard</h2>
      <div className="flex flex-wrap items-center justify-evenly gap-5">
        <Card title="Total Users" amount={data.users.length} />
        <Card title="Total Blogs" amount={data.blogs.length} />
        <Card title="Pages Created" amount={data.pages.length} />
        <Card title="Successful Events" amount={data.events.length} />
      </div>
      <div className="w-full">
        <h3 className="text-2xl font-bold mb-5">Blogs</h3>
        <div className="flex flex-wrap items-center justify-evenly gap-5">
          <Card
            title="Total Published Blogs"
            amount={data.blogs.filter((blog) => blog.isPublished).length}
          />

          <Card title="Pages Created" amount={data.pages.length} />
          <Card title="Successful Events" amount={data.events.length} />
        </div>
      </div>
    </div>
  );
}
