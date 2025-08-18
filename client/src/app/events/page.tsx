"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Contents from "../components/Contents";

type Event = {
  _id: string;
  name: string;
  typeOfEvent: string;
  description: string;
  guestSpeakers: string[];
  typeOfVenue: string;
  location: string;
  eventDate: string;
  status: "ongoing" | "completed" | "cancelled";
};

const PublicEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/all-events`
      );
      const data = await res.json();

      // You can filter ongoing or future events if you want
      const validEvents = data.events || [];
      setEvents(validEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-11/12 h-screen mx-auto mt-40 mb-16">
      <h1 className="text-4xl font-bold mb-10 text-center">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">
          No events available right now!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between h-[250px]"
            >
              <div className="flex flex-col gap-3">
                <Link href={`/events/${event._id}`}>
                  <h2 className="text-xl font-semibold text-blue-700 hover:underline line-clamp-2">
                    {event.name}
                  </h2>
                </Link>

                <p className="text-sm text-gray-500 italic capitalize">
                  {event.typeOfEvent} |{" "}
                  {new Date(event.eventDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <Contents shortened content={event.description} />
              </div>

              <span
                className={`capitalize mt-4 inline-block text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                  event.status === "ongoing"
                    ? "bg-green-100 text-green-700"
                    : event.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {event.status}
              </span>

              <Link
                href={`/events/${event._id}`}
                className="text-blue-600 hover:underline text-sm mt-auto pt-4"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicEvents;
