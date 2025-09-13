"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import Contents from "@/app/components/Contents";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import Title from "@/app/components/Title";

interface Document {
  _id: string;
  name: string;
  description?: string;
  bannerImage?: string;
  fileUrl: string;
}

const ViewDocument = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/${id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setDocument(data);
      } catch (error) {
        console.error("Failed to fetch document", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) return <Loader />;
  if (!document)
    return (
      <div className="text-center py-10 text-gray-500">Document not found.</div>
    );

  return (
    <div className="w-4/5 my-10 mx-auto flex flex-col gap-5">
      <Title text={document.name} />

      {document.bannerImage && (
        <Image
          src={document.bannerImage}
          alt={document.name}
          width={400}
          height={200}
          className="rounded-md w-full h-fit object-cover"
        />
      )}

      <div className="my-4">
        <h2 className="font-semibold text-2xl mb-5 underline">Description:</h2>
        <Contents content={document.description || "No description provided"} />
      </div>

      <div className="my-4">
        <h2 className="font-semibold mb-2">File</h2>
        {document.fileUrl ? (
          <Link
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download {document.fileUrl.split("/").pop()}
          </Link>
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="flex mt-5">
        <Button
          type="button"
          btnText="Back to Documents"
          primary
          onClickFunction={() => router.push("/dashboard/documents")}
        />
      </div>
    </div>
  );
};

export default ViewDocument;
