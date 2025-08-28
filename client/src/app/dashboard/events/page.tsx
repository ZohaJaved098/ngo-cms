"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import Contents from "@/app/components/Contents";
import Loader from "@/app/components/Loader";

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

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/all-events`
    );
    const data = await res.json();
    setEvents(data.events);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onViewClick = (id: string) => router.push(`/dashboard/events/${id}`);
  const onEditClick = (id: string) =>
    router.push(`/dashboard/events/edit/${id}`);
  const onDelete = async (id: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchEvents();
    setLoading(false);
  };

  if (loading) return <Loader />;
  return (
    <div className="flex flex-col gap-10 h-full w-full">
      <div className="flex justify-between items-center mt-5 w-full">
        <h3 className="text-xl font-semibold">All Events</h3>
        <Button
          type="button"
          btnText="Add new Event"
          secondary={true}
          onClickFunction={() => router.push("/dashboard/events/create")}
          className="max-w-40"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-300">
              {[
                "Name",
                "Type",
                "Description",
                "Speakers",
                "Venue",
                "Location",
                "Date & Time",
                "Registered",
                "Status",
                "View",
                "Edit",
                "Delete",
              ].map((heading, i) => (
                <th
                  key={i}
                  className="border border-gray-400 px-4 py-2 min-w-28 max-w-32"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td className="border border-gray-400 px-4 py-2 min-w-28 capitalize">
                  {event.name}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28 capitalize">
                  {event.typeOfEvent}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  <Contents shortened content={event.description} />
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  <ul className="">
                    {event.guestSpeakers.map((speaker, idx) => (
                      <li key={idx}>{speaker},</li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28 capitalize">
                  {event.typeOfVenue}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  {event.lng} , {event.lat}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  {new Date(event.eventDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  {event.registeredUsers?.length || 0}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28 capitalize">
                  {event.status}
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  <Button
                    type="button"
                    btnText="View"
                    secondary={true}
                    onClickFunction={() => onViewClick(event._id)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  <Button
                    type="button"
                    btnText="Edit"
                    tertiary={true}
                    onClickFunction={() => onEditClick(event._id)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 min-w-28">
                  <Button
                    type="button"
                    btnText="Delete"
                    primary={true}
                    onClickFunction={() => onDelete(event._id)}
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

export default Events;
