"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import Contents from "../components/Contents";

interface AlbumType {
  _id: string;
  albumTitle: string;
  albumDescription: string;
  images: { url: string; caption?: string }[];
}

const PublicGallery = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/all-galleries`
        );
        const data = await res.json();
        setAlbums(data || []);
      } catch (err) {
        console.error("Error fetching albums", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-11/12 mx-auto mt-40 ">
      <h1 className="text-3xl font-bold text-center mb-8">Photo Gallery</h1>
      {albums.length === 0 ? (
        <p className="text-center text-gray-600">No albums available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => {
            const coverImage = album.images[0]?.url;
            return (
              <Link
                key={album._id}
                href={`/gallery/${album._id}`}
                className="block border border-gray-300 rounded-lg shadow-lg hover:shadow-xl overflow-hidden"
              >
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt={album.albumTitle}
                    width={600}
                    height={400}
                    className="object-cover object-top w-full h-60"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{album.albumTitle}</h2>
                  <Contents content={album.albumDescription} shortened />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicGallery;
