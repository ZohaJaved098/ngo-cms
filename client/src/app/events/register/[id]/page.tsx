"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

type FormData = {
  name: string;
  email: string;
  occupation: string;
  reason: string;
};

type Errors = {
  name?: string;
  email?: string;
  occupation?: string;
  reason?: string;
};

const RegisterToEvent = () => {
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState<FormData>({
    name: user?.username || "",
    email: user?.email || "",
    occupation: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    const checkIfAlreadyRegistered = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/${id}`
      );
      const data = await res.json();

      const exists = data.event?.registeredUsers?.some(
        (u: { email: string }) => u.email === user?.email
      );
      setAlreadyRegistered(exists);
    };

    if (id && user?.email) checkIfAlreadyRegistered();
  }, [id, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_EVENTS_API_URL}/register/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    setErrors({});
    alert("Successfully registered!");
    router.push("/events");
  };

  return (
    <div className="w-4/5 max-w-xl mx-auto mt-40 flex flex-col gap-6 auth_gradient p-6 rounded-lg text-white">
      <h1 className="text-3xl font-bold">Register for Event</h1>

      <InputField
        label="Full Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={onChange}
        error={errors.name}
        disabled
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        error={errors.email}
        disabled
      />
      <InputField
        label="Occupation"
        name="occupation"
        type="text"
        value={formData.occupation}
        onChange={onChange}
        error={errors.occupation}
        placeholder="Student, Developer, etc."
      />
      <InputField
        label="Why are you joining?"
        name="reason"
        type="text"
        value={formData.reason}
        onChange={onChange}
        error={errors.reason}
        placeholder="Your motivation"
      />

      <Button
        btnText={
          alreadyRegistered ? "Already Registered" : "Submit Registration"
        }
        type="button"
        onClickFunction={onSubmit}
        primary={true}
        className="max-w-60 self-end"
        disabled={alreadyRegistered}
      />
    </div>
  );
};

export default RegisterToEvent;
