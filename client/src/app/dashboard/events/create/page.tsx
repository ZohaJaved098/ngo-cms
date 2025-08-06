"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import CkEditor from "@/app/components/CkEditor";
import { RadioInput } from "@/app/components/RadioInput";

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

const CreateEvent = () => {
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
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

  const onChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDescriptionChange = (editor: string, field: string) => {
    if (field === "description") {
      setDescription(editor);
    }
  };

  const onCreateClick = async () => {
    const payload = {
      ...formData,
      description: description || formData.description,
      guestSpeakers: formData.guestSpeakers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    setErrors({});
    router.push("/dashboard/events");
  };

  const onCancelClick = () => {
    router.push("/dashboard/events");
  };

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Create Event</h1>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex justify-between gap-5">
          <InputField
            label="Event Name"
            name="name"
            type="text"
            placeholder="Fundraiser Gala"
            value={formData.name}
            onChange={onChangeFunction}
            error={errors.name}
          />
          <InputField
            label="Event Type"
            name="typeOfEvent"
            type="text"
            placeholder="Fundraising"
            value={formData.typeOfEvent}
            onChange={onChangeFunction}
            error={errors.typeOfEvent}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="Guest Speakers (comma-separated)"
            name="guestSpeakers"
            type="text"
            placeholder="Speaker A, Speaker B"
            value={formData.guestSpeakers}
            onChange={onChangeFunction}
            error={errors.guestSpeakers}
          />
          <InputField
            label="Venue Type"
            name="typeOfVenue"
            type="text"
            placeholder="Auditorium"
            value={formData.typeOfVenue}
            onChange={onChangeFunction}
            error={errors.typeOfVenue}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="Location"
            name="location"
            type="text"
            placeholder="Islamabad, PK"
            value={formData.location}
            onChange={onChangeFunction}
            error={errors.location}
          />
          <InputField
            label="Event Date & Time"
            name="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={onChangeFunction}
            error={errors.eventDate}
          />
        </div>

        <div className="max-w-32 flex flex-col items-start">
          <label htmlFor="status" className="font-bold">
            Status
          </label>
          <RadioInput
            name="status"
            value={formData.status}
            onChange={onChangeFunction}
            options={["ongoing", "completed", "cancelled"]}
          />
          {errors.status && <p className="text-red-500">{errors.status}</p>}
        </div>

        <div className="flex flex-col items-center gap-5">
          <CkEditor
            editorData={description}
            setEditorData={setDescription}
            handleOnUpdate={onDescriptionChange}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-between mt-5">
          <Button
            type="button"
            btnText="Create Event"
            onClickFunction={onCreateClick}
            tertiary
            className="max-w-32"
          />
          <Button
            type="button"
            btnText="Cancel"
            onClickFunction={onCancelClick}
            primary
            className="max-w-32"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
