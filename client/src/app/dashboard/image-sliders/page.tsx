"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SliderImage {
  _id: string;
  imageUrl: string;
  alt: string;
  title: string;
}

const ImageSlider = () => {
  const [images, setImages] = useState<SliderImage[]>([]);
  const router = useRouter();
  // Fetch images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_IMAGES_API_URL}/all-images`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Failed to fetch slider images", error);
      }
    };

    fetchImages();
  }, []);

  const onNewClick = () => {
    router.push("/dashboard/image-sliders/create");
  };

  const onViewClick = (id: string) => {
    router.push(`/dashboard/image-sliders/${id}`);
  };

  const onEditClick = (id: string) => {
    router.push(`/dashboard/image-sliders/edit/${id}`);
  };

  const onDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_IMAGES_API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setImages((prev) => prev.filter((img) => img._id !== id));
      } catch (error) {
        console.error("Failed to delete image", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5">
        <h3 className="text-xl font-semibold">
          Images for Slider in Home Page
        </h3>
        <Button
          type="button"
          btnText="Add new Image"
          secondary={true}
          onClickFunction={onNewClick}
          className="max-w-40"
        />
      </div>

      {images.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border border-gray-300 rounded-md">
          No images found. Click “Add new Image” to create one.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-300">
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">View</th>
                <th className="border border-gray-300 px-4 py-2">
                  Change Image
                </th>
                <th className="border border-gray-300 px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img._id}>
                  <td className="border border-gray-400 px-4 py-2">
                    <Image
                      src={img.imageUrl}
                      alt={img.alt || "Slider image"}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {img.title}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText="View"
                      secondary={true}
                      onClickFunction={() => onViewClick(img._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText="Edit"
                      tertiary={true}
                      onClickFunction={() => onEditClick(img._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText="Delete"
                      primary={true}
                      onClickFunction={() => onDelete(img._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
