"use client";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import Title from "@/app/components/Title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type FormErrors = {
  username?: string;
  email?: string;
  role?: string;
  password?: string;
  profilePic?: string;
};
const NewAdmin = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "admin",
    password: "",
  });
  const onCancelClick = () => {
    setFormData({
      username: "",
      email: "",
      role: "admin",
      password: "",
    });
    router.push("/dashboard/users");
  };
  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const onProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onCreateClick = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (profilePic) formDataToSend.append("profilePic", profilePic);
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL}/create`,
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
      router.push("/dashboard/users");
    } catch (err) {
      console.error("Error creating admin:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-4/5 my-10 m-auto flex flex-col gap-5">
      <Title text="Add new Admin" />

      <form className="flex flex-col gap-5">
        <div className="h-32 w-32 mx-auto mt-5  rounded-full shadow-lg ">
          <Image
            src={
              previewUrl
                ? previewUrl
                : profilePic && typeof profilePic === "string"
                ? profilePic
                : `https://api.dicebear.com/6.x/avataaars/png?seed=${
                    formData.username || "default"
                  }`
            }
            alt="profile pic"
            className="rounded-full w-32 h-32 object-cover border-4 border-gray-300"
            width={100}
            height={100}
          />
        </div>
        <InputField
          label="Profile Pic"
          name="profilePic"
          type="file"
          accept="image/*"
          onChange={onProfilePicChange}
          error={errors.profilePic}
        />
        <div className="flex justify-between items-start gap-10 w-full">
          <InputField
            label="Name"
            name="username"
            value={formData.username}
            error={errors.username}
            type="text"
            placeholder="John Khan"
            onChange={onChangeFunction}
          />
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            error={errors.email}
            type="email"
            placeholder="abc@gmail.com"
            onChange={onChangeFunction}
          />
        </div>
        <div className="w-full">
          <InputField
            label="Assign Password"
            name="password"
            value={formData.password}
            error={errors.password}
            type="password"
            onChange={onChangeFunction}
          />
          <p className="text-gray-600 my-5 text-sm ">
            Write down password to keep it and email them their password.
            (Prompt them to change their password after successful login)
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Add them as Admin"
            onClickFunction={onCreateClick}
            tertiary={true}
            loading={loading}
          />
          <Button
            type="button"
            btnText="Cancel"
            primary={true}
            onClickFunction={onCancelClick}
          />
        </div>
      </form>
    </div>
  );
};

export default NewAdmin;
