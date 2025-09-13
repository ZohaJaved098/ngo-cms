"use client";

import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import CkEditor from "@/app/components/CkEditor";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Title from "@/app/components/Title";

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
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPages = await fetch(
          `${process.env.NEXT_PUBLIC_PAGES_API_URL}/all-pages`
        );
        const dataPages = await resPages.json();
        setParentPages(dataPages.pages.filter((p: ParentPage) => p._id !== id));

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
        setExistingImage(page.bannerImage || "");
      } catch (err) {
        console.error("Error fetching page data:", err);
      }
    };
    fetchData();
  }, [id]);

  const onContentChange = (editor: string, field: string): void => {
    if (field === "description") {
      setContent(editor);
    }
  };

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
      setExistingImage("");
    }
  };

  const onEditClick = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("isPublished", String(formData.isPublished));
    formDataToSend.append("parent", formData.parent);
    formDataToSend.append("content", content);
    if (bannerImage) {
      formDataToSend.append("bannerImage", bannerImage);
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formDataToSend,
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
    } finally {
      setLoading(false);
    }
  };

  const onCancelClick = () => {
    setFormData({
      title: "",
      slug: "",
      isPublished: false,
      parent: "",
      content: "",
    });
    router.push("/dashboard/pages");
  };

  return (
    <div className="w-4/5 my-10 m-auto flex flex-col gap-5">
      <Title text="Edit Page" />

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-5  ">
            <InputField
              label="Banner Image"
              name="bannerImage"
              type="file"
              accept="image/*"
              onChange={onBannerImageChange}
              error={errors.bannerImage}
            />
            {(existingImage || bannerImage) && (
              <Image
                src={
                  bannerImage ? URL.createObjectURL(bannerImage) : existingImage
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

        <div className="flex justify-between w-full items-center gap-3">
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

        <div>
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
        <div className="flex items-center justify-between">
          <Button
            type="button"
            btnText="Save Changes"
            onClickFunction={onEditClick}
            tertiary={true}
            loading={loading}
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

export default EditPage;
