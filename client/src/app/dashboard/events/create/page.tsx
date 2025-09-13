"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import CkEditor from "@/app/components/CkEditor";
import { RadioInput } from "@/app/components/RadioInput";
import Location from "@/app/components/Location";
import Title from "@/app/components/Title";

type FormErrors = {
  name?: string;
  typeOfEvent?: string;
  description?: string;
  guestSpeakers?: string;
  typeOfVenue?: string;
  lng?: string;
  lat?: string;
  eventDate?: string;
  status?: string;
  coverImage?: string;
};

const CreateEvent = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    typeOfEvent: "",
    description: "",
    guestSpeakers: "",
    typeOfVenue: "",
    lng: 0,
    lat: 0,
    eventDate: "",
    status: "",
  });
  const [description, setDescription] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

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

  const onCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const onCreateClick = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("typeOfEvent", formData.typeOfEvent);
    formDataToSend.append("description", description || formData.description);
    formDataToSend.append("guestSpeakers", formData.guestSpeakers);
    formDataToSend.append("typeOfVenue", formData.typeOfVenue);
    formDataToSend.append("lng", formData.lng.toString());
    formDataToSend.append("lat", formData.lat.toString());

    formDataToSend.append("eventDate", formData.eventDate);
    formDataToSend.append("status", formData.status);

    if (coverImage) {
      formDataToSend.append("coverImage", coverImage);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/create`,
      {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
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
      <Title text="Create Event" />
      <form method="POST" className="flex flex-col gap-5">
        {/* Cover Image */}
        <InputField
          label="Cover Image"
          name="coverImage"
          type="file"
          accept="image/*"
          onChange={onCoverImageChange}
          error={errors.coverImage}
        />

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
            label="Event Date & Time"
            name="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={onChangeFunction}
            error={errors.eventDate}
          />
          <div className="w-3/4 flex flex-col items-start">
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
        </div>
        <Location
          mode="create"
          lat={formData.lat}
          lng={formData.lng}
          onChange={(lat, lng) => {
            setFormData((prev) => ({ ...prev, lat, lng }));
          }}
        />
        {errors.lng && <p className="text-red-500">{errors.lng}</p>}

        <div className="flex flex-col items-center gap-5">
          <CkEditor
            editorData={description}
            setEditorData={setDescription}
            handleOnUpdate={onDescriptionChange}
            field={"description"}
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
          />
          <Button
            type="button"
            btnText="Cancel"
            onClickFunction={onCancelClick}
            primary
          />
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
