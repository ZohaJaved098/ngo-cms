"use client";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import Title from "@/app/components/Title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditBanner = () => {
  const router = useRouter();
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string | "">("");

  useEffect(() => {
    const fetchBannerImage = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/banner`
      );
      const data = await res.json();
      setBannerImage(data.bannerImage[0].bannerImage);
      setPreviewUrl(data.bannerImage[0].bannerImage);
    };
    fetchBannerImage();
  }, []);

  const onBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onEditClick = async () => {
    const formDataToSend = new FormData();
    if (bannerImage) {
      formDataToSend.append("bannerImage", bannerImage);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/edit-banner`,
        {
          method: "PUT",
          body: formDataToSend,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.message || "Something went wrong");
        return;
      }
      setErrors("");
      router.push(`/dashboard/donate/way-to-donate`);
    } catch (error) {
      console.error(error);
    }
  };
  const onCancelClick = () => {
    router.push("/dashboard/donate/way-to-donate");
  };

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title text="Edit Banner Image to Ways to Donate Page" />
      <form method="POST" className="flex flex-col gap-5">
        <InputField
          label="Banner Image"
          name="bannerImage"
          type="file"
          accept="image/*"
          onChange={onBannerImageChange}
          error={errors}
        />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            className=" rounded"
            width={800}
            height={600}
          />
        )}

        <div className="flex justify-between mt-5">
          <Button
            type="button"
            btnText="Save Edit"
            onClickFunction={onEditClick}
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

export default EditBanner;
