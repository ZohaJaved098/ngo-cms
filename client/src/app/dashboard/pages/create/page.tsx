"use client";

import { Button } from "@/app/components/Button";
import { useState, useEffect, useRef } from "react";
import { InputField } from "@/app/components/InputField";
import { useRouter } from "next/navigation";
import CkEditor from "@/app/components/CkEditor";

type FormErrors = {
  title?: string;
  slug?: string;
  content?: string;
  bannerImage?: string;
  isPublished?: string;
};

type ParentPage = {
  _id: string;
  title: string;
  slug: string;
};

const CreatePage = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isPublished: false,
    parent: "",
  });
  const [content, setContent] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [parentPages, setParentPages] = useState<ParentPage[]>([]);
  const router = useRouter();

  // Fetch all existing pages for parent dropdown
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`
        );
        const data = await res.json();
        setParentPages(data.pages);
      } catch (err) {
        console.error("Error fetching parent pages:", err);
      }
    };
    fetchPages();
  }, []);

  // CKEditor change
  const onContentChange = (editor: string, field: string): void => {
    if (field === "description") {
      setContent(editor);
    }
  };

  // input change handler
  const onChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "slug") {
      let formatted = value;
      if (!formatted.startsWith("/")) {
        formatted = "/" + formatted;
      }
      formatted = formatted.replace(/[^a-zA-Z0-9/-]/g, "");
      setFormData((prev) => ({ ...prev, slug: formatted }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const onBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage(e.target.files[0]);
    }
  };

  // Create page
  const onCreateClick = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("isPublished", String(formData.isPublished));
    formDataToSend.append("parent", formData.parent || "");
    formDataToSend.append("content", content);
    if (bannerImage) {
      formDataToSend.append("bannerImage", bannerImage);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAGES_API_URL}/create`,
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
      setFormData({
        title: "",
        slug: "",
        isPublished: false,
        parent: "",
      });
      setContent("");
      setBannerImage(null);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      router.push("/dashboard/pages");
    } catch (err) {
      console.error("Error creating page:", err);
    }
  };

  const onCancelClick = () => {
    setFormData({
      title: "",
      slug: "",
      isPublished: false,
      parent: "",
    });
    setContent("");
    setBannerImage(null);
    router.push("/dashboard/pages");
  };

  return (
    <div className="w-4/5 my-10 m-auto flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Create a Page</h1>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <InputField
            label="Banner Image"
            name="bannerImage"
            type="file"
            accept="image/*"
            onChange={onBannerImageChange}
            error={errors.bannerImage}
          />
        </div>
        {/* Title + Slug */}
        <div className="flex justify-between items-start gap-10 w-full">
          <InputField
            label="Title"
            name="title"
            value={formData.title}
            error={errors.title}
            type="text"
            placeholder="About Us"
            onChange={onChangeFunction}
          />
          <div className="flex flex-col w-full">
            <InputField
              label="Slug"
              name="slug"
              value={formData.slug}
              error={errors.slug}
              type="text"
              placeholder="/about-us"
              onChange={onChangeFunction}
            />
            <p className="text-xs text-right text-gray-500">
              Slug must contain only letters, numbers, hyphens (-), or slashes
              for nesting.
            </p>
          </div>
        </div>

        {/* Publish checkbox */}
        <div className="flex justify-between w-full items-center gap-3">
          {/* Parent page selection */}
          <div className="flex gap-5 items-center w-full">
            <label className="">Parent Page:</label>
            <select
              name="parent"
              value={formData.parent}
              onChange={onChangeFunction}
              className="border border-gray-300 outline-0 min-w-60 rounded p-2 text-sm"
            >
              <option value="">No Parent</option>
              {parentPages.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-5 items-center w-full">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={onChangeFunction}
              className="w-4 h-4"
            />
            <label>Published</label>
          </div>
        </div>

        {/* Content editor */}
        <div className="flex flex-col gap-3">
          <CkEditor
            editorData={content}
            setEditorData={setContent}
            handleOnUpdate={onContentChange}
            field={"description"}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
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
