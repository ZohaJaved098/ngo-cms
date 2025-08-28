"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";

type FormErrors = {
  name?: string;
  alt?: string;
  title?: string;
  image?: string;
};

const CreateImage = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    alt: "",
    title: "",
    description: "",
    link: "",
    ctaText: "",
    order: 0,
  });
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onCreateClick = async () => {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("alt", formData.alt);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("link", formData.link);
    formPayload.append("ctaText", formData.ctaText);
    formPayload.append("order", String(formData.order));
    if (file) {
      formPayload.append("image", file);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMAGES_API_URL}/create`,
        {
          method: "POST",
          credentials: "include",
          body: formPayload,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }

      setErrors({});
      router.push("/dashboard/image-sliders");
    } catch (error) {
      console.error("Error creating image", error);
    }
  };

  const onCancelClick = () => {
    router.push("/dashboard/images");
  };

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Add New Slider Image</h1>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex justify-between gap-5">
          <InputField
            label="Name"
            name="name"
            type="text"
            placeholder="Slide 1"
            value={formData.name}
            onChange={onChangeFunction}
            error={errors.name}
          />
          <InputField
            label="Alt Text"
            name="alt"
            type="text"
            placeholder="Description for accessibility"
            value={formData.alt}
            onChange={onChangeFunction}
            error={errors.alt}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="Title"
            name="title"
            type="text"
            placeholder="Welcome to Our NGO"
            value={formData.title}
            onChange={onChangeFunction}
            error={errors.title}
          />
          <InputField
            label="Description"
            name="description"
            type="text"
            placeholder="Short slide description"
            value={formData.description}
            onChange={onChangeFunction}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="CTA Link"
            name="link"
            type="text"
            placeholder="https://example.com"
            value={formData.link}
            onChange={onChangeFunction}
          />
          <InputField
            label="CTA Text"
            name="ctaText"
            type="text"
            placeholder="Learn More"
            value={formData.ctaText}
            onChange={onChangeFunction}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="Order"
            name="order"
            type="number"
            placeholder="0"
            value={formData.order.toString()}
            onChange={onChangeFunction}
          />
          <div className="flex flex-col w-full">
            <label className="font-bold">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="border border-gray-300 p-2 rounded-md"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center gap-5 mt-8">
          <Button
            type="button"
            btnText="Create Image"
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

export default CreateImage;
