"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";
import { IoCloseOutline } from "react-icons/io5";

interface ImageType {
  _id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageType;
  albumId: string;
  editable?: boolean;
  onUpdated?: (updatedImage: ImageType) => void;
  onDeleted?: (imageId: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  image,
  albumId,
  editable = false,
  onUpdated,
  onDeleted,
}) => {
  const [caption, setCaption] = useState<string>(image.caption || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaption(image.caption || "");
    setSelectedFile(null);
    setPreviewSrc(null);
    setError(null);
  }, [image, isOpen]);

  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("caption", caption ?? "");
      if (selectedFile) {
        form.append("image", selectedFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}/images/${image._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: form,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update image");
        return;
      }

      if (onUpdated) onUpdated(data);
      onClose();
    } catch (err) {
      console.error("Edit image error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this image?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}/images/${image._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to delete");
        return;
      }
      if (onDeleted) onDeleted(image._id);
      onClose();
    } catch (err) {
      console.error("Delete image error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg max-w-4xl w-full overflow-auto relative "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex gap-4 flex-col md:flex-row">
          <div className="flex-1 flex items-center justify-center">
            <div className="max-h-[80vh] w-full flex items-center justify-center">
              <Image
                src={previewSrc ?? image.url}
                alt={image.alt || image.caption || "Image"}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-auto"
                unoptimized
              />
            </div>
          </div>

          <div className="w-full md:w-96 flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Image details</h3>

            {caption && (
              <InputField
                label="Caption"
                name="caption"
                type="text"
                value={caption}
                onChange={(e) =>
                  setCaption((e.target as HTMLInputElement).value)
                }
              />
            )}

            {editable && (
              <>
                <InputField
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  label="Replace Image"
                  name="image"
                />
              </>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-2  mt-3">
              {editable ? (
                <>
                  <Button
                    type="button"
                    btnText={loading ? "Saving..." : "Save"}
                    onClickFunction={handleSave}
                    tertiary
                  />
                  <Button
                    type="button"
                    btnText="Delete"
                    onClickFunction={handleDelete}
                    primary
                  />
                </>
              ) : (
                <button
                  onClick={onClose}
                  title="Close"
                  className="absolute top-4 right-4  "
                >
                  <IoCloseOutline className="w-10 h-10 text-red-700 font-bold" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
