"use client";

import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import { RadioInput } from "@/app/components/RadioInput";
import CKEditor from "@/app/components/CkEditor";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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

const EditEvent = () => {
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        lng: event.lng,
        lat: event.lat,
        eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
        status: event.status,
      });
      setDescription(event.description);

      setPreviewUrl(event.coverImage || "");
    };

    if (id) fetchEvent();
  }, [id]);

  const onDescriptionChange = (editor: string, field: string): void => {
    if (field === "description") {
      setDescription(editor);
    }
  };
  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onEditClick = async () => {
    setLoading(true);
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("typeOfEvent", formData.typeOfEvent);
    formDataToSend.append("description", description || formData.description);
    formDataToSend.append(
      "guestSpeakers",
      JSON.stringify(formData.guestSpeakers.split(",").map((g) => g.trim()))
    );
    formDataToSend.append("typeOfVenue", formData.typeOfVenue);
    formDataToSend.append("lng", formData.lng.toString());
    formDataToSend.append("lat", formData.lat.toString());
    formDataToSend.append("eventDate", formData.eventDate);
    formDataToSend.append("status", formData.status);

    if (coverImage) {
      formDataToSend.append("coverImage", coverImage);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`, {
      method: "PUT",
      body: formDataToSend,
      credentials: "include",
    });

    const data = await res.json();
    console.log("data from event edit", data);

    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    setErrors({});
    setLoading(false);
    router.push("/dashboard/events");
  };

  const onCancelClick = () => {
    setFormData({
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
    setDescription("");
    setCoverImage(null);
    setPreviewUrl(null);
    router.push("/dashboard/events");
  };

  return (
    <div className="w-4/5 my-10 m-auto h-full flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <Title text="Edit Event" />
      </div>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <InputField
            label="Cover Image"
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={onCoverImageChange}
            error={errors.coverImage}
          />
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Event Cover"
              className=" rounded"
              width={800}
              height={600}
            />
          )}
        </div>

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

        <InputField
          label="Guest Speakers"
          name="guestSpeakers"
          value={formData.guestSpeakers}
          error={errors.guestSpeakers}
          type="text"
          placeholder="Jane, Zoha, John"
          onChange={onChangeFunction}
        />

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

        <InputField
          label="Event Date & Time"
          name="eventDate"
          value={formData.eventDate}
          error={errors.eventDate}
          type="datetime-local"
          onChange={onChangeFunction}
        />
        <InputField
          label="Venue Type"
          name="typeOfVenue"
          value={formData.typeOfVenue}
          error={errors.typeOfVenue}
          type="text"
          placeholder="Marquee, Hall"
          onChange={onChangeFunction}
        />
        <Location
          mode="edit"
          lat={formData.lat}
          lng={formData.lng}
          onChange={(lat, lng) => {
            setFormData((prev) => ({ ...prev, lat, lng }));
          }}
        />
        <div className="flex flex-col gap-2">
          <label className="font-bold">Event Description</label>
          <CKEditor
            editorData={description}
            setEditorData={setDescription}
            handleOnUpdate={onDescriptionChange}
            field={"description"}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        <hr className="w-full text-gray-300" />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Save Changes"
            onClickFunction={onEditClick}
            loading={loading}
            tertiary
          />
          <Button
            type="button"
            btnText="Cancel"
            primary
            onClickFunction={onCancelClick}
          />
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
