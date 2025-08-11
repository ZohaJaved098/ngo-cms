"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

type RegisteredUser = {
  name: string;
  email: string;
};

type Event = {
  _id: string;
  name: string;
  eventDate: string;
  description?: string;
  registeredUsers: RegisteredUser[];
};

const FilteredEventsPage = () => {
  const { view } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const userEmail = useSelector((state: RootState) => state.auth.user.email);

  useEffect(() => {
    const fetchAndFilter = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/all-events`
      );
      const data = await res.json();

      let filtered = data.events;

      if (view === "month") {
        const now = new Date();
        filtered = filtered.filter((event: Event) => {
          const date = new Date(event.eventDate);
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        });
      } else if (view === "registered") {
        filtered = filtered.filter((event: Event) =>
          event.registeredUsers.some((u) => u.email === userEmail)
        );
      }

      setEvents(filtered);
    };

    fetchAndFilter();
  }, [view, userEmail]);

  const getDaysLeft = (dateStr: string) => {
    const today = new Date();
    const eventDate = new Date(dateStr);
    const diffTime = eventDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return "Event ended";
    if (daysLeft === 0) return "Happening today!";
    return `${daysLeft} day(s) to go`;
  };

  return (
    <div className="w-4/5 mx-auto mt-40 h-screen flex flex-col gap-10">
      <h1 className="text-3xl font-bold">
        {view === "month"
          ? "Events This Month"
          : view === "registered"
          ? "Events You're Attending"
          : "Events"}
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-600">No events found 😕</p>
      ) : (
        <ul className="w-3/4 mx-auto">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col gap-2"
            >
              <h2 className="text-xl font-semibold text-blue-700">
                {event.name}
              </h2>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {new Date(event.eventDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-base text-green-600 font-bold">
                  {getDaysLeft(event.eventDate)}
                </p>
              </div>

              {event.description && (
                <p
                  className="text-gray-800 text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                ></p>
              )}

              <Link
                href={`/events/${event._id}`}
                className="self-start text-blue-600 hover:underline flex items-center justify-center gap-2 mt-5 text-sm font-medium"
              >
                View Details <FaArrowRight />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredEventsPage;
