"use client";

import { Button } from "@/app/components/Button";
import Contents from "@/app/components/Contents";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RegisteredUser = {
  name: string;
  email: string;
  occupation: string;
  reason: string;
};

type Event = {
  _id: string;
  name: string;
  typeOfEvent: string;
  description: string;
  guestSpeakers: string[];
  typeOfVenue: string;
  location: string;
  eventDate: string;
  registeredUsers: RegisteredUser[];
  status: "completed" | "ongoing" | "cancelled";
};

const ViewEvent = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`
      );
      const data = await res.json();
      setEvent(data.event);
    };
    fetchEvent();
  }, [id]);

  const onEditClick = () => {
    router.push(`/dashboard/events/edit/${id}`);
  };

  const onCancelClick = () => {
    router.push(`/dashboard/events`);
  };

  if (!event) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="w-4/5 mx-auto my-10 flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className=" flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-gray-600 text-base capitalize">
            {event.typeOfEvent}
          </p>
        </div>
        <span
          className={`capitalize text-sm font-semibold px-3 py-1 rounded-full ${
            event.status === "ongoing"
              ? "bg-green-100 text-green-700"
              : event.status === "completed"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {event.status}
        </span>
      </div>

      <Contents content={event.description} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold">Speakers:</h3>
          <ul className="flex flex-col gap-3 capitalize">
            {event.guestSpeakers.map((speaker, i) => (
              <li className="list-none" key={i}>
                {speaker}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Date & Time:</h3>
          <p>
            {new Date(event.eventDate).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div>
          <h3 className="font-bold">Venue:</h3>
          <p className="capitalize">{event.typeOfVenue}</p>
          <p className="text-gray-700">{event.location}</p>
        </div>

        <div>
          <h3 className="font-bold">Total Registrations</h3>
          <p>{event.registeredUsers?.length || 0}</p>
        </div>
      </div>

      {event.registeredUsers && event.registeredUsers.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mt-5 mb-2">Registered Users</h3>
          <ul className="  space-y-1">
            {event.registeredUsers.map((user, idx) => (
              <li key={idx}>
                <em>
                  <strong>{user.name}</strong>
                </em>{" "}
                – {user.email} ({user.occupation}) – <em>{user.reason}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
      <hr className="text-gray-500" />

      <div className="flex justify-between items-center gap-5 mt-8">
        <Button
          type="button"
          btnText="Edit"
          onClickFunction={onEditClick}
          tertiary={true}
          className="max-w-32"
        />
        <Button
          type="button"
          btnText="Go Back"
          onClickFunction={onCancelClick}
          primary={true}
          className="max-w-32"
        />
      </div>
    </div>
  );
};

export default ViewEvent;
