"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import Loader from "@/app/components/Loader";
import { RadioInput } from "@/app/components/RadioInput";
import Image from "next/image";
import Title from "@/app/components/Title";

type ContactType = "email" | "phone" | "social" | "";

type FormState = {
  type: ContactType;
  value: string;
};

type FormErrors = {
  type?: string;
  value?: string;
  contactIcon?: string;
};

const EditContact: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [contactIcon, setContactIcon] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    type: "",
    value: "",
  });

  useEffect(() => {
    // fetch contact details
    const fetchContact = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CONTACT_API_URL}/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setForm({
          type: data.contact.type || "",
          value: data.contact.value || "",
        });
        setPreviewUrl(data.contact.contactIcon || "");
      } catch (err) {
        console.error("Error fetching contact:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as FormState));
  };
  const onContactIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContactIcon(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  const onUpdateClick = async () => {
    const errs: FormErrors = {};
    if (!form.type) errs.type = "Contact type is required";
    if (!form.value) errs.value = "Contact value is required";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    const fd = new FormData();
    fd.append("type", form.type);
    fd.append("value", form.value);
    if (contactIcon) fd.append("contactIcon", contactIcon);

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CONTACT_API_URL}/${id}`,
        {
          method: "PUT",
          body: fd,
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }

      console.log(" Contact updated:", data);
      router.push("/dashboard/people/contact");
    } catch (err) {
      console.error("Error updating contact:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title text="Edit Contact" />
      <div className="flex flex-col gap-3">
        <InputField
          label="Contact Icon"
          name="contactIcon"
          type="file"
          accept="image/*"
          onChange={onContactIconChange}
          error={errors.contactIcon}
        />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="contact icon"
            className=" rounded"
            width={200}
            height={200}
          />
        )}
      </div>

      <div className="w-3/4 flex flex-col items-start">
        <label className="font-bold">Contact Type</label>
        <RadioInput
          name="type"
          value={form.type}
          onChange={onChangeInput}
          options={["email", "phone", "social"]}
        />
        {errors.type && <p className="text-red-500">{errors.type}</p>}
      </div>

      <InputField
        label="Contact Value"
        name="value"
        type="text"
        placeholder="example@email.com / +92 300 1234567 / https://twitter.com/..."
        value={form.value}
        onChange={onChangeInput}
        error={errors.value}
      />

      <div className="flex justify-between mt-5">
        <Button
          type="button"
          btnText="Update Contact"
          onClickFunction={onUpdateClick}
          tertiary
        />
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={() => router.push("/dashboard/people/contact")}
          primary
        />
      </div>
    </div>
  );
};

export default EditContact;
