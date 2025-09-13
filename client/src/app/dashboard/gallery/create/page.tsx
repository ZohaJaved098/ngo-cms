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
  file?: string;
  bannerImage?: string;
};

const CreateDocument = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editorDescription, setEditorDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const img = e.target.files[0];
      setBannerImage(img);
      setPreviewBanner(URL.createObjectURL(img));
    }
  };

  const onDescriptionChange = (editor: string, field: string) => {
    if (field === "description") {
      setEditorDescription(editor);
    }
  };

  const onCreateClick = async () => {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append(
      "description",
      editorDescription || formData.description
    );
    if (bannerImage) formPayload.append("bannerImage", bannerImage);
    if (file) formPayload.append("file", file);

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const onCancelClick = () => {
    router.push("/dashboard/documents");
  };

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title text="Add New Document" />

      <form method="POST" className="flex flex-col gap-5">
        <InputField
          label="Document Name"
          name="name"
          type="text"
          placeholder="Annual Report 2025"
          value={formData.name}
          onChange={onChangeFunction}
          error={errors.name}
        />

        <div className="flex flex-col">
          <InputField
            label="Upload Banner Image"
            name="bannerImage"
            type="file"
            accept="image/*"
            onChange={onBannerChange}
            error={errors.bannerImage}
          />
          {previewBanner && (
            <div className="mt-3">
              <Image
                src={previewBanner}
                alt="Banner Preview"
                width={200}
                height={200}
                className="rounded-md object-cover w-48 h-32"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <InputField
            label="Upload Document File"
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={onFileChange}
            error={errors.file}
          />
        </div>

        <div className="flex flex-col">
          <label className="my-2 font-medium">Document Description</label>
          <CkEditor
            editorData={editorDescription}
            setEditorData={setEditorDescription}
            handleOnUpdate={onDescriptionChange}
            field={"description"}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-between mt-5">
          <Button
            type="button"
            btnText="Create Document"
            onClickFunction={onCreateClick}
            tertiary
            loading={loading}
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

export default CreateDocument;
