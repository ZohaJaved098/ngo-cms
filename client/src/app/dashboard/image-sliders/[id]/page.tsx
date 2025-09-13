"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";

interface SliderImage {
  _id: string;
  name: string;
  alt: string;
  title: string;
  description?: string;
  link?: string;
  ctaText?: string;
  order: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

const ViewImage = () => {
  const [image, setImage] = useState<SliderImage | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const imageId = params?.id as string;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMAGES_API_URL}/${imageId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setImage(data.image);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching image", error);
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  if (loading) {
    return <Loader />;
  }

  if (!image) {
    return <div className="text-center py-8 text-red-500">Image not found</div>;
  }

  return (
    <div className="w-4/5 my-10 mx-auto flex flex-col gap-8">
      <Title text={image.title} />

      <div className="w-full flex justify-center">
        <Image
          src={image.imageUrl}
          alt={image.alt}
          width={700}
          height={450}
          className="rounded-lg border shadow-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Image Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-800">{image.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Alt Text</p>
            <p className="font-medium text-gray-800">{image.alt}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium text-gray-800">
              {image.description || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CTA Text</p>
            <p className="font-medium text-gray-800">{image.ctaText || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Link</p>
            {image.link ? (
              <a
                href={image.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {image.link}
              </a>
            ) : (
              <p className="font-medium text-gray-800">—</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Order</p>
            <p className="font-medium text-gray-800">{image.order}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium text-gray-800">
              {image.createdAt && new Date(image.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Updated At</p>
            <p className="font-medium text-gray-800">
              {image.updatedAt && new Date(image.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-5 mt-8">
        <Button
          type="button"
          btnText="Edit"
          tertiary
          onClickFunction={() =>
            router.push(`/dashboard/image-sliders/edit/${image._id}`)
          }
        />
        <Button
          type="button"
          btnText="Back to List"
          primary
          onClickFunction={() => router.push("/dashboard/image-sliders")}
        />
      </div>
    </div>
  );
};

export default ViewImage;
