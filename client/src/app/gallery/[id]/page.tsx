"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import ImageModal from "@/app/components/ImageModal";
import Contents from "@/app/components/Contents";
import Title from "@/app/components/Title";
interface ImageType {
  _id: string;
  url: string;
  caption: string;
}

interface AlbumType {
  _id: string;
  albumTitle: string;
  albumDescription: string;
  images: ImageType[];
}

const PublicGalleryAlbum = () => {
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const params = useParams();
  const albumId = params?.id as string;

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${albumId}`
        );
        const data = await res.json();
        setAlbum(data);
      } catch (err) {
        console.error("Error fetching album", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  if (loading) return <Loader />;
  if (!album) return <p className="text-center py-10">Album not found.</p>;

  return (
    <div className="w-11/12 mx-auto mt-40 my-10">
      <Title text={album.albumTitle} />

      {album.albumDescription && <Contents content={album.albumDescription} />}
      <p className="text-right font-light text-gray-500">
        Click on image to view them
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-5">
        {album.images.map((img) => (
          <div
            key={img._id}
            className="cursor-pointer relative rounded-md overflow-hidden shadow"
            onClick={() => setSelectedImage(img)}
          >
            <Image
              src={img.url}
              alt={img.caption || album.albumTitle}
              width={600}
              height={400}
              className="object-cover w-full h-48 hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={true}
          onClose={() => setSelectedImage(null)}
          image={selectedImage}
          albumId={album._id}
          editable={false}
        />
      )}
    </div>
  );
};

export default PublicGalleryAlbum;
