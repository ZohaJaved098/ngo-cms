"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import Contents from "@/app/components/Contents";
import Image from "next/image";
import Link from "next/link";

interface Document {
  _id: string;
  name: string;
  description: string;
  fileUrl: string;
  isPublished: boolean;
  bannerImage?: string;
}

const DocumentDashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/all-documents`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        // console.log("data from dashboard documents", data);

        setDocuments(data || "");
      } catch (err) {
        console.error("Failed to fetch documents", err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const onNewClick = () => router.push("/dashboard/documents/create");
  const onViewClick = (id: string) => router.push(`/dashboard/documents/${id}`);
  const onEditClick = (id: string) =>
    router.push(`/dashboard/documents/edit/${id}`);

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setActionLoading(id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Failed to delete document", err);
    } finally {
      setActionLoading(null);
    }
  };

  const onTogglePublish = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/${id}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const updated: Document = await res.json();
      setDocuments((prev) =>
        prev.map((doc) => (doc._id === id ? updated : doc))
      );
    } catch (err) {
      console.error("Failed to toggle publish", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5">
        <h3 className="text-xl font-semibold">Documents</h3>
        <Button
          type="button"
          btnText="Add New Document"
          secondary
          onClickFunction={onNewClick}
          className="max-w-40"
        />
      </div>

      {documents.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border border-gray-300 rounded-md">
          No documents found. Click “Add New Document” to create one.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-300">
                <th className="border px-4 py-2">Banner</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">File</th>
                <th className="border px-4 py-2">Publish</th>
                <th className="border px-4 py-2">View</th>
                <th className="border px-4 py-2">Edit</th>
                <th className="border px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td className=" max-w-28 border px-4 py-2">
                    {doc.bannerImage ? (
                      <Image
                        src={doc.bannerImage}
                        width={100}
                        height={100}
                        alt={doc.name}
                        className="object-cover w-auto rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className=" max-w-28 border px-4 py-2">{doc.name}</td>
                  <td className=" max-w-28 border px-4 py-2 ">
                    <Contents shortened={true} content={doc.description} />
                  </td>
                  <td className=" max-w-28 border px-4 py-2">
                    {doc.fileUrl ? (
                      <Link
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Download
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className=" max-w-28 border px-4 py-2">
                    <Button
                      type="button"
                      btnText={doc.isPublished ? "Unpublish" : "Publish"}
                      secondary
                      onClickFunction={() => onTogglePublish(doc._id)}
                      disabled={actionLoading === doc._id}
                    />
                  </td>
                  <td className=" max-w-28 border px-4 py-2">
                    <Button
                      type="button"
                      btnText="View"
                      secondary
                      onClickFunction={() => onViewClick(doc._id)}
                    />
                  </td>
                  <td className=" max-w-28 border px-4 py-2">
                    <Button
                      type="button"
                      btnText="Edit"
                      tertiary
                      onClickFunction={() => onEditClick(doc._id)}
                    />
                  </td>
                  <td className=" max-w-28 border px-4 py-2">
                    <Button
                      type="button"
                      btnText="Delete"
                      primary
                      onClickFunction={() => onDelete(doc._id)}
                      disabled={actionLoading === doc._id}
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

export default DocumentDashboard;
