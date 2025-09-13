"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import Image from "next/image";
import CkEditor from "@/app/components/CkEditor";
import Title from "@/app/components/Title";

type FormErrors = {
  name?: string;
  description?: string;
  bannerImage?: string;
  fileUrl?: string;
};

const CreateDocument = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [description, setDescription] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDescriptionChange = (editor: string, field: string) => {
    if (field === "description") {
      setDescription(editor);
    }
  };

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "file"
  ) => {
    if (!e.target.files) return;
    if (type === "banner") setBannerImage(e.target.files[0]);
    else setFile(e.target.files[0]);
  };

  const onCreateClick = async () => {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", description);
    if (bannerImage) formPayload.append("bannerImage", bannerImage);
    if (file) formPayload.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/create`,
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
      router.push("/dashboard/documents");
    } catch (error) {
      console.error("Error creating document", error);
    }
  };

  const onCancelClick = () => router.push("/dashboard/documents");

  return (
    <div className="w-4/5 my-10 mx-auto flex flex-col gap-5">
      <Title text="Add New Document" />

      <InputField
        label="Document Title"
        name="name"
        type="text"
        placeholder="Document Title"
        value={formData.name}
        onChange={onChangeFunction}
        error={errors.name}
      />

      <div className="flex flex-col">
        <InputField
          label="Banner Image"
          name="bannerImage"
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e, "banner")}
          error={errors.bannerImage}
        />
        {bannerImage && (
          <Image
            src={URL.createObjectURL(bannerImage)}
            alt="Banner Preview"
            width={200}
            height={200}
            className="rounded-md object-cover mt-2"
          />
        )}
      </div>

      <div className="flex flex-col">
        <InputField
          label="Document File"
          name="file"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={(e) => onFileChange(e, "file")}
          error={errors.fileUrl}
        />
        {file && <span className="mt-2 text-sm">{file.name}</span>}
      </div>

      <div className="flex flex-col">
        <label className="my-2">Description</label>
        <CkEditor
          editorData={description}
          setEditorData={setDescription}
          handleOnUpdate={onDescriptionChange}
          field={"description"}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-between w-full gap-4 ">
        <Button
          type="button"
          btnText="Create"
          onClickFunction={onCreateClick}
          tertiary
        />
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={onCancelClick}
          primary
        />
      </div>
    </div>
  );
};

export default CreateDocument;
