"use client";

import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import { RadioInput } from "@/app/components/RadioInput";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type FormErrors = {
  name?: string;
  typeOfEvent?: string;
  description?: string;
  guestSpeakers?: string;
  typeOfVenue?: string;
  location?: string;
  eventDate?: string;
  status?: string;
};

const EditEvent = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    typeOfEvent: "",
    description: "",
    guestSpeakers: "",
    typeOfVenue: "",
    location: "",
    eventDate: "",
    status: "",
  });

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`
      );
      const data = await res.json();
      const event = data.event;

      setFormData({
        name: event.name,
        typeOfEvent: event.typeOfEvent,
        description: event.description,
        guestSpeakers: event.guestSpeakers.join(", "),
        typeOfVenue: event.typeOfVenue,
        location: event.location,
        eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
        status: event.status,
      });
    };

    if (id) fetchEvent();
  }, [id]);

  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onEditClick = async () => {
    const payload = {
      ...formData,
      guestSpeakers: formData.guestSpeakers.split(",").map((g) => g.trim()),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    setErrors({});
    router.push("/dashboard/events");
  };

  const onCancelClick = () => {
    setFormData({
      name: "",
      typeOfEvent: "",
      description: "",
      guestSpeakers: "",
      typeOfVenue: "",
      location: "",
      eventDate: "",
      status: "",
    });
    router.push("/dashboard/events");
  };

  return (
    <div className="w-4/5 my-10 m-auto h-full flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <h1 className="font-bold text-3xl">Edit Event</h1>
      </div>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex justify-between items-start gap-5 w-full">
          <InputField
            label="Event Name"
            name="name"
            value={formData.name}
            error={errors.name}
            type="text"
            placeholder="Fundraising Gala"
            onChange={onChangeFunction}
          />
          <InputField
            label="Event Type"
            name="typeOfEvent"
            value={formData.typeOfEvent}
            error={errors.typeOfEvent}
            type="text"
            placeholder="Fundraising"
            onChange={onChangeFunction}
          />
        </div>

        <div className="flex justify-between items-start gap-5 w-full">
          <InputField
            label="Venue Type"
            name="typeOfVenue"
            value={formData.typeOfVenue}
            error={errors.typeOfVenue}
            type="text"
            placeholder="Marquee, Hall"
            onChange={onChangeFunction}
          />
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            error={errors.location}
            type="text"
            placeholder="Lahore, PK"
            onChange={onChangeFunction}
          />
        </div>

        <InputField
          label="Guest Speakers"
          name="guestSpeakers"
          value={formData.guestSpeakers}
          error={errors.guestSpeakers}
          type="text"
          placeholder="Jane, Zoha, John"
          onChange={onChangeFunction}
        />

        <InputField
          label="Event Date & Time"
          name="eventDate"
          value={formData.eventDate}
          error={errors.eventDate}
          type="datetime-local"
          onChange={onChangeFunction}
        />

        <label className="font-bold">Event Description</label>
        <textarea
          name="description"
          placeholder="Write about the event..."
          value={formData.description}
          onChange={onChangeFunction}
          className="border border-gray-300 p-3 rounded-md h-32 resize-none"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}

        <div className="max-w-32 flex flex-col items-start justify-center">
          <label htmlFor="status" className="capitalize font-bold">
            Status
          </label>
          <RadioInput
            name="status"
            value={formData.status}
            onChange={onChangeFunction}
            options={["ongoing", "completed", "cancelled"]}
          />
        </div>

        <hr className="w-full text-gray-400" />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Save Changes"
            onClickFunction={onEditClick}
            tertiary={true}
            className="max-w-32"
          />
          <Button
            type="button"
            btnText="Cancel"
            primary={true}
            onClickFunction={onCancelClick}
            className="max-w-32"
          />
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
