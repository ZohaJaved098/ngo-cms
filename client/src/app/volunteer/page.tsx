"use client";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "@/app/assets/Logo.png";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
type FormData = {
  name: string;
  email: string;
  motivation: string;
};
type FormErrors = {
  name?: string;
  email?: string;
};
const Volunteers = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    motivation: "",
  });
  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };
  const onSubmitClick = async () => {
    const errs: FormErrors = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.email) errs.email = "Email is required";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_VOLUNTEER_API_URL}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            motivation: formData.motivation,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }
      console.log("data saved", data);

      router.push("/");
    } catch (error) {
      console.error("Error creating contact:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className={`h-screen w-screen mt-32 `}>
      <Image
        src={"https://volunteer.alkhidmat.org/files/form-bg.jpg"}
        alt="bg"
        width={1000}
        height={1000}
        className="w-full h-fit object-cover relative"
      />
      <div className="flex items-center gap-3 w-4/5 m-auto z-20 absolute top-40 left-10 right-10 ">
        <div className="flex flex-col justify-around rounded-lg bg-white text-gray-600 w-1/2 h-[350px] p-10 ">
          <Image src={Logo} alt="logo" width={150} height={150} />
          <h1 className="text-4xl text-pretty text-center flex flex-col gap-5">
            Welcome to
            <span className="font-black text-3xl text-blue-400 shadow">
              <i>Volunteer Management System</i>
            </span>
          </h1>
        </div>
        <form className="flex flex-col gap-3 rounded-lg bg-white text-gray-600 w-1/2 max-h-[350px] p-10 overflow-y-scroll">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            onChange={onChangeInput}
            error={errors.name}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            onChange={onChangeInput}
            error={errors.email}
          />
          <div className="flex flex-col gap-5">
            <label htmlFor="motivation">
              Why you wanna join our Volunteer team? (Optional)
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={onChangeInput}
              className="border rounded p-2 focus:outline-0"
            />
          </div>
          <div className="flex gap-3 self-end items-center">
            <Button
              btnText="Discard"
              type="button"
              onClickFunction={() => {
                router.push("/");
                setFormData({ name: "", email: "", motivation: "" });
              }}
              secondary
            />
            <Button
              btnText="Submit"
              type="button"
              onClickFunction={onSubmitClick}
              primary
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Volunteers;
