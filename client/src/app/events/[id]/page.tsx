"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import RelevantLinks from "@/app/components/RelevantLinks";
import { Button } from "@/app/components/Button";
import { RootState } from "@/app/redux/store";

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

const EventDetailPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchEventAndRelated = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`
      );
      const data = await res.json();
      const fetchedEvent = data.event;
      setEvent(fetchedEvent);

      // check if user already registered
      const isRegistered = fetchedEvent.registeredUsers?.some(
        (u: RegisteredUser) => u.email === user?.email
      );
      setAlreadyRegistered(isRegistered);

      // get related events
      const allRes = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/all-events`
      );
      const allData = await allRes.json();

      const related = allData.events
        .filter((e: Event) => e._id !== id && e.status === "ongoing")
        .slice(0, 4);

      setRelatedEvents(related);
    };

    if (id) fetchEventAndRelated();
  }, [id, user]);

  const handleRegisterClick = (id: string) => {
    router.push(`register/${id}`);
  };

  if (!event) return <p className="text-center mt-20">Loading event...</p>;

  const isButtonDisabled = alreadyRegistered || event.status !== "ongoing";
  const buttonText = alreadyRegistered ? "Already Registered" : "Register now!";

  return (
    <div className="flex justify-center gap-10 mt-40 p-4 mx-auto items-start w-11/12">
      {/* Main content */}
      <div className="w-4/5 flex flex-col gap-6">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-4xl font-bold">{event.name}</h1>
          <span className="text-gray-700 capitalize font-medium text-lg">
            {event.typeOfEvent}
          </span>
        </div>

        <div className="flex gap-10 justify-between items-start ">
          <div>
            <p className="font-semibold">Date:</p>
            <p>
              {new Date(event.eventDate).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="font-semibold ">Venue:</p>
            <p className="capitalize">
              {event.typeOfVenue} — {event.location}
            </p>
          </div>
          {event.registeredUsers && event.registeredUsers.length > 0 && (
            <div className="flex items-center gap-3">
              <h2 className="font-semibold">Registered Users:</h2>
              <span className=" font-bold text-lg">
                {event.registeredUsers.length}
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="font-semibold">Speakers:</p>
          <ul className="ml-3">
            {event.guestSpeakers.map((speaker, i) => (
              <li key={i}>{speaker}</li>
            ))}
          </ul>
        </div>

        <hr className="border-gray-300" />

        <div
          className="text-base leading-relaxed text-gray-800 space-y-4
            [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-6
            [&_img]:rounded-lg [&_img]:mx-auto"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        <Button
          btnText={buttonText}
          type="button"
          onClickFunction={() => handleRegisterClick(event._id)}
          secondary={true}
          className="max-w-40"
          disabled={isButtonDisabled}
        />
      </div>

      {/* Sidebar */}
      <RelevantLinks
        heading="Similar Events"
        items={relatedEvents.map((e) => ({
          _id: e._id,
          name: e.name,
          type: "event",
        }))}
      />
    </div>
  );
};

export default EventDetailPage;
