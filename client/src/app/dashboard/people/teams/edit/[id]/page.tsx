"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import Loader from "@/app/components/Loader";
import Image from "next/image";
import Title from "@/app/components/Title";

type FormState = {
  _id?: string;
  name: string;
  role: string;
};

type FormErrors = {
  name?: string;
  role?: string;
  memberPic?: string;
};

const EditTeam: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormState>({
    name: "",
    role: "",
  });
  const [memberPic, setMemberPic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    // fetch team details
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TEAM_API_URL}/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setForm({
          name: data.team.name || "",
          role: data.team.role || "",
        });
        setMemberPic(data.team.memberPic || "");
      } catch (err) {
        console.error("Error fetching contact:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [id]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as FormState));
  };

  const onMemberPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMemberPic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onUpdateClick = async () => {
    const errs: FormErrors = {};
    if (!form.name) errs.name = "Team Member name is required";
    if (!form.role) errs.role = "Role is required";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("role", form.role);
    if (memberPic) fd.append("memberPic", memberPic);

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_TEAM_API_URL}/${id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }

      console.log(" Team updated:", data);
      router.push("/dashboard/people/teams");
    } catch (err) {
      console.error("Error updating teams:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title text="Edit Member Information" />
      <div className="w-1/2  m-auto mt-5">
        <Image
          src={
            previewUrl
              ? previewUrl
              : memberPic && typeof memberPic === "string"
              ? memberPic
              : `https://api.dicebear.com/6.x/avataaars/png?seed=${
                  form.name || "default"
                }`
          }
          alt="Member profile pic"
          className="rounded-full object-cover"
          width={200}
          height={200}
        />
      </div>
      <InputField
        label="Member Profile Pic"
        name="memberPic"
        type="file"
        accept="image/*"
        onChange={onMemberPicChange}
        error={errors.memberPic}
      />
      <InputField
        label="Name of Member"
        name="name"
        type="text"
        value={form.name}
        onChange={onChangeInput}
        error={errors.name}
      />
      <InputField
        label="Role of Member"
        name="role"
        type="text"
        value={form.role}
        onChange={onChangeInput}
        error={errors.role}
      />

      <div className="flex justify-between mt-5">
        <Button
          type="button"
          btnText="Update Member"
          onClickFunction={onUpdateClick}
          tertiary
        />
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={() => router.push("/dashboard/people/teams")}
          primary
        />
      </div>
    </div>
  );
};

export default EditTeam;
