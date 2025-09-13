"use client";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Title from "../components/Title";
import Chart from "../components/Chart";
import AppTabs from "../components/Tabs";
import generateColors from "@/app/util/helper";
type User = { _id: string; username: string; email: string };
type Page = { title: string; slug: string; content: string };
type Event = {
  _id: string;
  name: string;
  typeOfEvent: string;
  description: string;
  guestSpeakers: string[];
  typeOfVenue: string;
  lat: number;
  lng: number;
  eventDate: string;
  registeredUsers: {
    name: string;
    email: string;
    occupation: string;
    reason: string;
  }[];
  status: "completed" | "ongoing" | "cancelled";
};

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

type Donations = {
  _id: string;
  donorName: string;
  amount: number;
  way: Way;
  donorEmail: string;
  donateStatus: string;
};
type Way = {
  _id: string;
  bankingType: string;
  cause: string;
  causeDescription: string;
};
type Teams = {
  _id: string;
  name: string;
  role: string;
  memberPic: string;
};

export default function Dashboard() {
  const [data, setData] = useState<{
    users: User[];
    pages: Page[];
    events: Event[];
    blogs: Blog[];
    donations: Donations[];
    ways: Way[];
    team: Teams[];
  } | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [
          usersRes,
          pagesRes,
          eventsRes,
          blogsRes,
          waysRes,
          donationsRes,
          teamRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/admin/all-users`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`),
          fetch(`${process.env.NEXT_PUBLIC_EVENTS_API_URL}/all-events`),
          fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/all-blogs`),
          fetch(`${process.env.NEXT_PUBLIC_DONATION_API_URL}/all-ways`),
          fetch(`${process.env.NEXT_PUBLIC_DONATION_API_URL}/donated`),
          fetch(`${process.env.NEXT_PUBLIC_TEAM_API_URL}`),
        ]);

        if (
          !usersRes.ok ||
          !pagesRes.ok ||
          !eventsRes.ok ||
          !blogsRes.ok ||
          !waysRes.ok ||
          !donationsRes.ok ||
          !teamRes.ok
        ) {
          throw new Error("Failed to fetch some dashboard data");
        }
        const usersData = await usersRes.json();
        const pagesData = await pagesRes.json();
        const eventsData = await eventsRes.json();
        const blogsData = await blogsRes.json();
        const donationsData = await donationsRes.json();
        const teamData = await teamRes.json();
        const waysData = await waysRes.json();

        setData({
          users: usersData.users,
          pages: pagesData.pages,
          events: eventsData.events,
          blogs: blogsData.blogs,
          donations: donationsData.donations,
          team: teamData.team,
          ways: waysData.waysToDonate,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    }

    fetchDashboardData();
  }, []);

  if (!data) return <Loader />;
  return (
    <div className="w-full flex flex-col gap-10 p-5">
      <Title text="Dashboard" />
      <div className="flex flex-wrap items-center justify-evenly gap-5">
        <Card title="Total Users" amount={data.users.length} />
        <Card title="Total Blogs" amount={data.blogs.length} />
        <Card
          title="Total Published Blogs"
          amount={data.blogs.filter((blog) => blog.isPublished).length}
        />
        <Card title="Pages Created" amount={data.pages.length} />
        <Card title="Total Events" amount={data.events.length} />
        <Card title="Team Members" amount={data.team.length} />
        <Card
          title="Total Donations"
          amount={data.donations.reduce((sum, d) => sum + d.amount, 0)}
          money
        />
      </div>

      <div className="flex flex-col md:flex-row w-full items-start justify-between gap-5">
        <div className="w-1/2 md:w-full h-[300px] m-auto my-5">
          <h3 className="text-gray-700 text-lg mb-10 font-semibold">
            Donation made by each User:
          </h3>
          <Chart
            type="doughnut"
            data={{
              labels: data.donations.map((d) => d.donorName || "Anonymous"),
              datasets: [
                {
                  data: data.donations.map((d) => d.amount),
                  backgroundColor: generateColors(data.donations.length),
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
            className="h-fit w-fit mt-3"
          />
        </div>
        <div className="w-2/5 md:w-full h-[500px] m-auto my-5">
          <h3 className="text-gray-700 text-lg font-semibold">
            Published VS Draft Blogs
          </h3>
          <Chart
            type="bar"
            data={{
              labels: ["Published", "Draft"],
              datasets: [
                {
                  label: "Published Vs Drafts",
                  data: [
                    data.blogs.filter((b) => b.isPublished).length,
                    data.blogs.filter((b) => !b.isPublished).length,
                  ],
                  backgroundColor: ["#22c55e", "#ef44e4"],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
            }}
            className="h-fit w-fit mt-3"
          />
        </div>
      </div>
      <div className="w-4/5 h-full m-auto my-10 shadow-2xl border border-gray-400 rounded-lg">
        <AppTabs
          tabs={[
            {
              label: "Event",
              value: "event",
              content: (
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-red-200 text-left">
                    <tr className="border-b-2 border-b-red-800">
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Event Name
                      </th>
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Event Type
                      </th>
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Registered Users
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.events.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-2">{event.name}</td>
                        <td className="px-4 py-2">{event.typeOfEvent}</td>
                        <td className="px-4 py-2">
                          {event.registeredUsers.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
            },
            {
              label: "Blogs",
              value: "blogs",
              content: (
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-red-200 text-left">
                    <tr className="border-b-2 border-b-red-800">
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Blogs
                      </th>
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Blog Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.blogs.map((blog) => (
                      <tr
                        className="hover:bg-gray-50 transition-colors"
                        key={blog._id}
                      >
                        <td className="px-4 py-2 ">{blog.name}</td>
                        <td className="px-4 py-2 ">{blog.typeOfBlog}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
            },
            {
              label: "Donations",
              value: "donations",
              content: (
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-red-200 text-left">
                    <tr className="border-b-2 border-b-red-800">
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Causes
                      </th>
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Donated By
                      </th>
                      <th className="text-red-700 text-lg px-4 py-2 font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.donations.map((donation) => (
                      <tr
                        className="hover:bg-gray-50 transition-colors"
                        key={donation._id}
                      >
                        <td className="px-4 py-2 ">{donation.way.cause}</td>
                        <td className="px-4 py-2 ">{donation.donorName}</td>
                        <td className="px-4 py-2 ">{donation.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
