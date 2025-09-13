"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import Contents from "@/app/components/Contents";
import Title from "@/app/components/Title";

interface Album {
  _id: string;
  albumTitle: string;
  albumDescription?: string;
  isPublished: boolean;
  images: { _id: string; url: string }[];
}

const GalleryDashboard = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/all-galleries`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setAlbums(data || []);
      } catch (error) {
        console.error("Failed to fetch albums", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const onNewClick = () => {
    router.push("/dashboard/gallery/create");
  };

  const onViewClick = (id: string) => {
    router.push(`/dashboard/gallery/${id}`);
  };

  const onEditClick = (id: string) => {
    router.push(`/dashboard/gallery/edit/${id}`);
  };

  const onDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setLoading(true);
      try {
        await fetch(`${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        setAlbums((prev) => prev.filter((album) => album._id !== id));
      } catch (error) {
        console.error("Failed to delete album", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onTogglePublish = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GALLERY_API_URL}/${id}/toggle-publish`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const updated = await res.json();
      setAlbums((prev) =>
        prev.map((album) => (album._id === id ? updated.gallery : album))
      );
    } catch (error) {
      console.error("Failed to toggle publish", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5">
        <Title text="Gallery Albums" />
        <Button
          type="button"
          btnText="Add New Album"
          secondary={true}
          onClickFunction={onNewClick}
        />
      </div>

      {albums.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border border-gray-300 rounded-md">
          No albums found. Click “Add New Album” to create one.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-300">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2"># Images</th>
                <th className="border border-gray-300 px-4 py-2">Published</th>
                <th className="border border-gray-300 px-4 py-2">View</th>
                <th className="border border-gray-300 px-4 py-2">Edit</th>
                <th className="border border-gray-300 px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album) => (
                <tr key={album._id}>
                  <td className="border border-gray-400 px-4 py-2">
                    {album.albumTitle}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Contents
                      shortened
                      content={album.albumDescription || "—"}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {album.images.length}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText={album.isPublished ? "Unpublish" : "Publish"}
                      secondary={true}
                      onClickFunction={() => onTogglePublish(album._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText="View"
                      secondary={true}
                      onClickFunction={() => onViewClick(album._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText="Edit"
                      tertiary={true}
                      onClickFunction={() => onEditClick(album._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <Button
                      type="button"
                      btnText="Delete"
                      primary={true}
                      onClickFunction={() => onDelete(album._id)}
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

export default GalleryDashboard;
