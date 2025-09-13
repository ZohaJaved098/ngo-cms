"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { InputField } from "@/app/components/InputField";
import CkEditor from "@/app/components/CkEditor";

type FormErrors = {
  albumTitle?: string;
  albumDescription?: string;
  images?: string;
};

interface BackendImage {
  _id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface GalleryResponse {
  _id: string;
  albumTitle: string;
  albumDescription: string;
  images: BackendImage[];
  isPublished: boolean;
}

type ExistingImage = {
  _id: string;
  url: string;
  caption: string;
  remove: boolean;
};

type NewImage = {
  file: File;
  preview: string;
  caption: string;
};

const MAX_NEW_FILES = 10;

const EditAlbum = () => {
  const router = useRouter();
  const params = useParams() as { id: string };
  const albumId = params.id;

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumDescription, setAlbumDescription] = useState<string>("");

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);

  // ───────────────────────────────── Fetch album
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}`,
          { credentials: "include" }
        );
        const data: GalleryResponse = await res.json();
        if (!res.ok) {
          console.error(data);
          return;
        }
        setAlbumTitle(data.albumTitle || "");
        setAlbumDescription(data.albumDescription || "");
        setExistingImages(
          (data.images || []).map((img) => ({
            _id: img._id,
            url: img.url,
            caption: img.caption || "",
            remove: false,
          }))
        );
      } catch (e) {
        console.error("Failed to load album", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [albumId]);

  // ───────────────────────────────── File add / remove
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    if (newImages.length + selected.length > MAX_NEW_FILES) {
      setErrors((prev) => ({
        ...prev,
        images: `You can upload a maximum of ${MAX_NEW_FILES} images per update.`,
      }));
      return;
    }

    const pack: NewImage[] = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }));

    setNewImages((prev) => [...prev, ...pack]);
    setErrors((prev) => ({ ...prev, images: undefined }));
    // reset input so same file(s) can be picked again if needed
    e.currentTarget.value = "";
  };

  // revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      newImages.forEach((n) => URL.revokeObjectURL(n.preview));
    };
  }, [newImages]);

  const updateExistingCaption = (id: string, caption: string) => {
    setExistingImages((prev) =>
      prev.map((img) => (img._id === id ? { ...img, caption } : img))
    );
  };

  const toggleRemoveExisting = (id: string) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img._id === id ? { ...img, remove: !img.remove } : img
      )
    );
  };

  const updateNewCaption = (index: number, caption: string) => {
    setNewImages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], caption };
      return copy;
    });
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      // revoke URL to avoid leaks
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ───────────────────────────────── Submit
  const onUpdateClick = async () => {
    const form = new FormData();
    form.append("albumTitle", albumTitle);
    form.append("albumDescription", albumDescription);

    // existingCaptions: only for images NOT being removed
    const captionsMap: Record<string, string> = {};
    existingImages.forEach((img) => {
      if (!img.remove) captionsMap[img._id] = img.caption || "";
    });
    form.append("existingCaptions", JSON.stringify(captionsMap));

    // removeImages: ids marked for removal
    const toRemove = existingImages.filter((i) => i.remove).map((i) => i._id);
    form.append("removeImages", JSON.stringify(toRemove));

    // new images + their captions (aligned by order)
    newImages.forEach((n) => {
      form.append("images", n.file);
      form.append("captions", n.caption);
    });

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}`,
        {
          method: "PUT",
          credentials: "include",
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }
      // success
      setErrors({});
      router.push("/dashboard/gallery");
    } catch (e) {
      console.error("Error updating album", e);
    } finally {
      setLoading(false);
    }
  };

  const onCancelClick = () => router.push("/dashboard/gallery");

  const totalKept = useMemo(
    () => existingImages.filter((i) => !i.remove).length,
    [existingImages]
  );

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-6">
      <h1 className="font-bold text-3xl">Edit Album</h1>

      <InputField
        label="Album Title"
        name="albumTitle"
        type="text"
        placeholder="Summer Trip 2025"
        value={albumTitle}
        onChange={(e) => setAlbumTitle(e.target.value)}
        error={errors.albumTitle}
      />

      {/* Existing images */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">
            Existing Images ({totalKept} kept)
          </h2>
          <p className="text-sm text-gray-500">
            Toggle “Remove” to delete an image on save.
          </p>
        </div>

        {existingImages.length === 0 ? (
          <div className="text-gray-500 border rounded p-4">
            No images in this album yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {existingImages.map((img) => (
              <div
                key={img._id}
                className="border border-gray-300 shadow-xl  rounded-md p-3 space-y-2"
              >
                <div className="relative">
                  <Image
                    src={img.url}
                    alt={img.caption || "Album image"}
                    width={600}
                    height={400}
                    className="rounded-md w-full h-48 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => toggleRemoveExisting(img._id)}
                    className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-md ${
                      img.remove ? "bg-red-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {img.remove ? "Will Remove" : "Remove"}
                  </button>
                </div>

                <InputField
                  label="Caption"
                  name={`caption-${img._id}`}
                  type="text"
                  placeholder="Add caption..."
                  value={img.caption}
                  onChange={(e) =>
                    updateExistingCaption(img._id, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <InputField
          label={`Upload New Images (max ${MAX_NEW_FILES} per update)`}
          name="images"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          error={errors.images}
        />

        {newImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {newImages.map((n, idx) => (
              <div
                key={`${n.preview}-${idx}`}
                className="border border-gray-300 shadow-xl rounded-md p-3 space-y-2"
              >
                <div className="relative">
                  <Image
                    src={n.preview}
                    alt={`New image ${idx + 1}`}
                    width={600}
                    height={400}
                    className="rounded-md w-full h-48 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-red-600 text-white"
                  >
                    Remove
                  </button>
                </div>

                <InputField
                  label="New Image Caption"
                  name={`new-caption-${idx}`}
                  type="text"
                  placeholder="Add caption..."
                  value={n.caption}
                  onChange={(e) => updateNewCaption(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <label className="my-2 font-medium">Album Description</label>
        <CkEditor
          editorData={albumDescription}
          setEditorData={setAlbumDescription}
          field={"description"}
          handleOnUpdate={(editor: string, field: string) => {
            if (field === "description") {
              setAlbumDescription(editor);
            }
          }}
        />

        {errors.albumDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.albumDescription}</p>
        )}
      </div>

      <div className="flex justify-between mt-2">
        <Button
          type="button"
          btnText={loading ? "Saving..." : "Update Album"}
          onClickFunction={onUpdateClick}
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

export default EditAlbum;
