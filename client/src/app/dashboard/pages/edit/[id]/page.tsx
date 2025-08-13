"use client";

import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import CkEditor from "@/app/components/CkEditor";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type FormErrors = {
  title?: string;
  slug?: string;
  content?: string;
};

type ParentPage = {
  _id: string;
  title: string;
  slug: string;
};

const EditPage = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isPublished: false,
    parent: "",
    content: "",
  });
  const [content, setContent] = useState<string>("");
  const [parentPages, setParentPages] = useState<ParentPage[]>([]);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Fetch page details & parent pages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all pages for parent dropdown
        const resPages = await fetch(
          `${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`
        );
        const dataPages = await resPages.json();
        setParentPages(dataPages.pages.filter((p: ParentPage) => p._id !== id)); // exclude self

        // Get current page details
        const resPage = await fetch(
          `${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`
        );
        const dataPage = await resPage.json();
        const page = dataPage.page;

        setFormData({
          title: page.title,
          slug: page.slug,
          isPublished: page.isPublished,
          parent: page.parent?._id || "",
          content: page.content,
        });
        setContent(page.content);
      } catch (err) {
        console.error("Error fetching page data:", err);
      }
    };
    fetchData();
  }, [id]);

  // CKEditor change
  const onContentChange = (editor: string, field: string): void => {
    if (field === "description") {
      setContent(editor);
    }
  };

  // Input change handler
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

  // Save changes
  const onEditClick = async () => {
    const payload = {
      ...formData,
      content: content || formData.content,
      parent: formData.parent || null,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }

      setErrors({});
      router.push("/dashboard/pages");
    } catch (err) {
      console.error("Error updating page:", err);
    }
  };

  const onCancelClick = () => {
    router.push("/dashboard/pages");
  };

  return (
    <div className="w-4/5 my-10 m-auto flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Edit Page</h1>

      <form className="flex flex-col gap-5">
        {/* Title + Slug */}
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
            <p className="text-xs text-gray-500">
              Slug can contain only letters, numbers, hyphens (-), and slashes
              (/) for nesting.
            </p>
          </div>
        </div>

        {/* Publish checkbox */}
        <div className="flex justify-between w-full items-center gap-3">
          {/* Parent page selection */}
          <div className="flex gap-5 items-center w-full">
            <label className="font-bold">Parent Page</label>
            <select
              name="parent"
              value={formData.parent}
              onChange={onChangeFunction}
              className="border border-gray-300 rounded p-2 text-sm"
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
        <div>
          <CkEditor
            editorData={content}
            setEditorData={setContent}
            handleOnUpdate={onContentChange}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Save Changes"
            onClickFunction={onEditClick}
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

export default EditPage;
