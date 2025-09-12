"use client";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type FormErrors = {
  username?: string;
  email?: string;
  role?: string;
  password?: string;
};
const NewAdmin = () => {
  //   const [user, setUser] = useState<User>();
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
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
  const onCreateClick = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    // formDataToSend.append("role", formData.role);
    formDataToSend.append("password", formData.password);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL}/create`,
        {
          method: "POST",
          //   body: formDataToSend,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
    }
  };
  return (
    <div className="w-4/5 my-10 m-auto flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Add new Admin</h1>

      <form className="flex flex-col gap-5">
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

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Add them as Admin"
            onClickFunction={onCreateClick}
            tertiary={true}
            className="max-w-fit"
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

export default NewAdmin;
