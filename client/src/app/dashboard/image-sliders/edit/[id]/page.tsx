"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";

type FormErrors = {
  name?: string;
  alt?: string;
  title?: string;
  image?: string;
};

interface SliderImage {
  _id: string;
  name: string;
  alt: string;
  title: string;
  description?: string;
  link?: string;
  ctaText?: string;
  order: number;
  imageUrl: string;
}

const EditImage = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<Partial<SliderImage>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const imageId = params?.id as string;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMAGES_API_URL}/${imageId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setFormData(data.image);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching image", error);
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

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

  const onUpdateClick = async () => {
    const formPayload = new FormData();
    if (formData.name) formPayload.append("name", formData.name);
    if (formData.alt) formPayload.append("alt", formData.alt);
    if (formData.title) formPayload.append("title", formData.title);
    if (formData.description)
      formPayload.append("description", formData.description);
    if (formData.link) formPayload.append("link", formData.link);
    if (formData.ctaText) formPayload.append("ctaText", formData.ctaText);
    if (formData.order !== undefined)
      formPayload.append("order", String(formData.order));
    if (file) {
      formPayload.append("image", file);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMAGES_API_URL}/${imageId}`,
        {
          method: "PUT",
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
      console.error("Error updating image", error);
    }
  };

  const onCancelClick = () => {
    router.push("/dashboard/image-sliders");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title text="Edit Slider Image" />
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex justify-between gap-5">
          <InputField
            label="Name"
            name="name"
            type="text"
            placeholder="Slide 1"
            value={formData.name || ""}
            onChange={onChangeFunction}
            error={errors.name}
          />
          <InputField
            label="Alt Text"
            name="alt"
            type="text"
            placeholder="Description for accessibility"
            value={formData.alt || ""}
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
            value={formData.title || ""}
            onChange={onChangeFunction}
            error={errors.title}
          />
          <InputField
            label="Description"
            name="description"
            type="text"
            placeholder="Short slide description"
            value={formData.description || ""}
            onChange={onChangeFunction}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="CTA Link"
            name="link"
            type="text"
            placeholder="https://example.com"
            value={formData.link || ""}
            onChange={onChangeFunction}
          />
          <InputField
            label="CTA Text"
            name="ctaText"
            type="text"
            placeholder="Learn More"
            value={formData.ctaText || ""}
            onChange={onChangeFunction}
          />
        </div>

        <div className="flex justify-between gap-5">
          <InputField
            label="Order"
            name="order"
            type="number"
            placeholder="0"
            value={formData.order?.toString() || "0"}
            onChange={onChangeFunction}
          />
          <div className="flex flex-col w-full">
            <InputField
              label={`Upload New Image (optional)`}
              name="image"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              error={errors.image}
            />
            {formData.imageUrl && (
              <Image
                src={formData.imageUrl}
                alt={formData.alt || ""}
                width={100}
                height={100}
                className="mt-2 w-40 rounded-md border"
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center gap-5 mt-8">
          <Button
            type="button"
            btnText="Update Image"
            onClickFunction={onUpdateClick}
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

export default EditImage;
