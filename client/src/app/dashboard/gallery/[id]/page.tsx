"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import Contents from "@/app/components/Contents";
import Loader from "@/app/components/Loader";
import ImageModal from "@/app/components/ImageModal";

interface ImageType {
  _id: string;
  url: string;
  alt?: string;
  caption?: string;
}

interface AlbumType {
  _id: string;
  albumTitle: string;
  albumDescription?: string;
  images: ImageType[];
  isPublished: boolean;
}

const ViewAlbum = () => {
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<ImageType | null>(null);
  const [modalEditable, setModalEditable] = useState(false);

  const params = useParams() as { id: string };
  const albumId = params.id;
  const router = useRouter();

  useEffect(() => {
    const fetchAlbum = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Error loading album:", data.message);
          return;
        }
        setAlbum(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  const handleOpenView = (img: ImageType) => {
    setModalEditable(false);
    setModalImage(img);
  };

  const handleOpenEdit = (img: ImageType) => {
    setModalEditable(true);
    setModalImage(img);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}/images/${imageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete image");
        return;
      }
      setAlbum((prev) =>
        prev
          ? { ...prev, images: prev.images.filter((i) => i._id !== imageId) }
          : prev
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleModalUpdated = (updatedImage: ImageType) => {
    // Replace image in album state
    setAlbum((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.map((img) =>
              img._id === updatedImage._id ? updatedImage : img
            ),
          }
        : prev
    );
  };

  const handleModalDeleted = (imageId: string) => {
    setAlbum((prev) =>
      prev
        ? { ...prev, images: prev.images.filter((i) => i._id !== imageId) }
        : prev
    );
  };

  if (loading) return <Loader />;
  if (!album) return <p className="text-center py-10">Album not found.</p>;

  return (
    <div className="w-4/5 my-10 mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl">{album.albumTitle}</h1>

        <div className="flex gap-3">
          <Button
            type="button"
            btnText="Edit Album"
            onClickFunction={() =>
              router.push(`/dashboard/gallery/edit/${albumId}`)
            }
            tertiary
          />
          <Button
            type="button"
            btnText="Go back"
            secondary
            className="max-w-28"
            onClickFunction={() => router.push("/dashboard/gallery")}
          />
        </div>
      </div>

      <Contents content={album.albumDescription || ""} />

      <h2 className="font-semibold text-xl mt-5 mb-2">Album Images</h2>

      {album.images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="flex flex-wrap w-full gap-5">
          {album.images.map((img) => (
            <div
              key={img._id}
              className="relative group shadow-lg border border-gray-400 rounded-md p-3 flex flex-col items-center"
            >
              <Image
                src={img.url}
                alt={img.alt || img.caption || "Image"}
                width={800}
                height={600}
                className="rounded-md object-cover w-60 h-60"
              />
              <div className="flex flex-col gap-5 my-5 items-center justify-center ">
                {img.caption && (
                  <p className="text-lg text-gray-900">{img.caption}</p>
                )}
                <div className="flex items-center justify-evenly gap-3 p-3 w-full">
                  <Button
                    btnText="View"
                    type="button"
                    secondary
                    onClickFunction={() => handleOpenView(img)}
                  />
                  <Button
                    btnText="Edit"
                    type="button"
                    tertiary
                    onClickFunction={() => handleOpenEdit(img)}
                  />
                  <Button
                    btnText="Delete"
                    type="button"
                    onClickFunction={() => handleDeleteImage(img._id)}
                    primary
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal (view or edit) */}
      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          image={modalImage}
          albumId={albumId}
          editable={modalEditable}
          onUpdated={(img) => handleModalUpdated(img)}
          onDeleted={(id) => handleModalDeleted(id)}
        />
      )}
    </div>
  );
};

export default ViewAlbum;
