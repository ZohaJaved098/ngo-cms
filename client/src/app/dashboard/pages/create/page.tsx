"use client";
import { Button } from "@/app/components/Button";
import { useState } from "react";
import { InputField } from "@/app/components/InputField";
import { useRouter } from "next/navigation";
import CkEditor from "@/app/components/CkEditor";
import { RadioInput } from "@/app/components/RadioInput";

type FormErrors = {
  title?: string;
  slug?: string;
  content?: string;
  status?: string;
};
const CreatePage = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "",
  });
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const onContentChange = (editor: string, field: string): void => {
    if (field === "description") {
      setContent(editor);
    }
  };
  const onChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCreateClick = async () => {
    const payload = {
      ...formData,
      content,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_PAGES_API_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    setErrors({});
    setFormData({
      title: "",
      slug: "",
      content: "",
      status: "",
    });
    setContent("");

    router.push("/dashboard/pages");
  };

  const onCancelClick = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      status: "",
    });
    router.push("/dashboard/pages");
  };
  return (
    <div className="w-4/5 my-10 m-auto h-full flex flex-col gap-5">
      <div className="flex items-start justify-between ">
        <h1 className="font-bold text-3xl">Create a page</h1>
      </div>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex justify-between items-start gap-5 w-full">
          <InputField
            label="Title"
            name="title"
            value={formData.title}
            error={errors.title}
            type="text"
            placeholder="About Us"
            onChange={onChangeFunction}
          />
          <div className="flex flex-col">
            <InputField
              label="Slug"
              name="slug"
              value={formData.slug}
              error={errors.slug}
              type="text"
              placeholder="/about-us"
              onChange={onChangeFunction}
            />
            <p className=" text-xs text-gray-500">
              Slugs must start with / and can have letters, numbers and -
              (dash). No other character would be acceptable.
            </p>
          </div>
        </div>
        <hr className="w-full text-gray-400 " />
        <div className="max-w-32 flex flex-col items-start justify-center ">
          <label htmlFor={"status"} className="capitalize font-bold">
            Status
          </label>
          <RadioInput
            name="status"
            value={formData.status}
            onChange={onChangeFunction}
            options={["inProgress", "published", "unpublished"]}
          />
        </div>
        <div className="flex flex-col items-center gap-5 w-full">
          <CkEditor
            editorData={content}
            setEditorData={setContent}
            handleOnUpdate={onContentChange}
          />
          {errors.content && <p className="text-red-500  ">{errors.content}</p>}
        </div>
        <hr className="w-full text-gray-400 " />
        <div className="flex items-center justify-between ">
          <Button
            type="button"
            btnText="Create Page"
            onClickFunction={onCreateClick}
            tertiary={true}
            className="max-w-32"
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

export default CreatePage;
