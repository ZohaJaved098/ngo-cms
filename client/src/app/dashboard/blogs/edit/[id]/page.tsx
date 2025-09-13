"use client";

import { Button } from "@/app/components/Button";
import { useEffect, useState } from "react";
import { InputField } from "@/app/components/InputField";
import { useRouter, useParams } from "next/navigation";
import CkEditor from "@/app/components/CkEditor";
import { RadioInput } from "@/app/components/RadioInput";
import Image from "next/image";
import Title from "@/app/components/Title";

type FormErrors = {
  name?: string;
  typeOfBlog?: string;
  content?: string;
  author?: string;
  tags?: string;
  isPublished?: string;
  headerImage?: string;
};

const EditBlog = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    typeOfBlog: "",
    content: "",
    author: "",
    tags: "",
    isPublished: "",
  });
  const [content, setContent] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`);
      const data = await res.json();
      const blog = data.blog;

      setFormData({
        name: blog.name,
        typeOfBlog: blog.typeOfBlog,
        content: blog.content,
        author: blog.author.join(", "),
        tags: blog.tags.join(", "),
        isPublished: blog.isPublished ? "published" : "unpublished",
      });
      setContent(blog.content);
      setExistingImage(blog.headerImage || "");
    };

    if (id) fetchBlog();
  }, [id]);

  const onContentChange = (editor: string, field: string): void => {
    if (field === "description") {
      setContent(editor);
    }
  };

  const onChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeaderImage(e.target.files[0]);
      setExistingImage("");
    }
  };

  const onEditClick = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("typeOfBlog", formData.typeOfBlog);
    formDataToSend.append("content", content || formData.content);

    formDataToSend.append("author", formData.author);
    formDataToSend.append("tags", formData.tags);

    formDataToSend.append(
      "isPublished",
      formData.isPublished === "published" ? "true" : "false"
    );

    if (headerImage) {
      formDataToSend.append("headerImage", headerImage);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BLOGS_API_URL}/${id}`, {
      method: "PUT",
      body: formDataToSend,
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    setErrors({});
    router.push("/dashboard/blogs");
  };

  const onCancelClick = () => {
    setFormData({
      name: "",
      typeOfBlog: "",
      content: "",
      author: "",
      tags: "",
      isPublished: "",
    });
    setContent("");
    setHeaderImage(null);
    setExistingImage("");
    router.push("/dashboard/blogs");
  };

  return (
    <div className="w-4/5 my-10 m-auto flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <Title text="Edit Blog" />
      </div>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-5  ">
            <InputField
              label="Banner Image"
              name="headerImage"
              type="file"
              accept="image/*"
              onChange={onHeaderImageChange}
              error={errors.headerImage}
            />
            {(existingImage || headerImage) && (
              <Image
                src={
                  headerImage ? URL.createObjectURL(headerImage) : existingImage
                }
                alt="Current Header"
                className=" rounded"
                width={800}
                height={600}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-start gap-5 w-full">
          <InputField
            label="Title of Blog"
            name="name"
            value={formData.name}
            error={errors.name}
            type="text"
            placeholder="Help raise a child"
            onChange={onChangeFunction}
          />
          <InputField
            label="Type of Blog"
            name="typeOfBlog"
            value={formData.typeOfBlog}
            error={errors.typeOfBlog}
            type="text"
            placeholder="Fundraising"
            onChange={onChangeFunction}
          />
        </div>

        <div className="flex justify-between items-start gap-5 w-full">
          <InputField
            label="Author(s) of Blog"
            name="author"
            value={formData.author}
            error={errors.author}
            type="text"
            placeholder="e.g. Zoha Javed, Sara Khan"
            onChange={onChangeFunction}
          />
          <InputField
            label="Tags"
            name="tags"
            value={formData.tags}
            error={errors.tags}
            type="text"
            placeholder="e.g. donate, education, urgent"
            onChange={onChangeFunction}
          />
        </div>

        <hr className="w-full text-gray-400" />

        <div className="max-w-32 flex flex-col items-start justify-center">
          <label htmlFor={"isPublished"} className="capitalize font-bold">
            Published
          </label>
          <RadioInput
            name="isPublished"
            value={formData.isPublished}
            onChange={onChangeFunction}
            options={["published", "unpublished"]}
          />
        </div>

        <div className="flex flex-col items-center gap-5 w-full">
          <CkEditor
            editorData={content}
            setEditorData={setContent}
            handleOnUpdate={onContentChange}
            field={"description"}
          />
          {errors.content && <p className="text-red-500">{errors.content}</p>}
        </div>

        <hr className="w-full text-gray-400" />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Save Changes"
            onClickFunction={onEditClick}
            tertiary={true}
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

export default EditBlog;
