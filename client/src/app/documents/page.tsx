"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import { Button } from "@/app/components/Button";
import Contents from "../components/Contents";

interface Document {
  _id: string;
  name: string;
  bannerImage?: string;
  fileUrl: string;
  description?: string;
  isPublished: boolean;
}

const PublicDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/all-documents`,
          { credentials: "include" }
        );
        const data = await res.json();
        const PublishedData = data.filter((doc: Document) => doc.isPublished);
        setDocuments(PublishedData);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  if (loading) return <Loader />;

  if (!documents.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No documents available.
      </div>
    );

  return (
    <div className="w-11/12 mx-auto mt-40 my-10">
      <h1 className="text-3xl font-bold mb-6">All Documents</h1>
      <div className="flex flex-wrap gap-10">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="border border-gray-300 rounded-md p-4 max-h-96 flex md:max-w-1/2 items-center gap-3 hover:shadow-md transition"
          >
            {doc.bannerImage ? (
              <Image
                src={doc.bannerImage}
                alt={doc.name}
                width={300}
                height={150}
                className="object-cover h-40 w-60 rounded"
              />
            ) : (
              <div className="bg-gray-200 h-36 flex items-center justify-center text-gray-400 rounded">
                No Image
              </div>
            )}
            <div className="flex flex-col justify-between items-start h-full">
              <div className="w-40 flex flex-col gap-3 items-start">
                <h2 className="font-semibold text-lg">{doc.name}</h2>
                <Contents
                  shortened
                  content={doc.description || "No description provided"}
                />
              </div>
              <div className="flex items-end justify-end gap-2 mt-2">
                <Button
                  type="button"
                  btnText="View"
                  secondary
                  className="max-w-28 max-h-10"
                  onClickFunction={() => router.push(`/documents/${doc._id}`)}
                />
                <Button
                  type="button"
                  btnText="Download"
                  primary
                  className="max-w-28 max-h-10"
                  onClickFunction={() => window.open(doc.fileUrl, "_blank")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicDocuments;
