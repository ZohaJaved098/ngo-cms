"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Contents from "@/app/components/Contents";
import RelevantLinks from "@/app/components/RelevantLinks";
import { Button } from "@/app/components/Button";

type Document = {
  _id: string;
  name: string;
  description?: string;
  bannerImage?: string;
  fileUrl: string;
  isPublished: boolean;
};

const DocumentViewPage = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [relatedDocs, setRelatedDocs] = useState<Document[]>([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchDocumentAndRelated = async () => {
      try {
        // Fetch the main document
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/${id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setDocument(data);

        const allRes = await fetch(
          `${process.env.NEXT_PUBLIC_DOCUMENT_API_URL}/all-documents`,
          { credentials: "include" }
        );
        const allData = await allRes.json();

        const related = allData
          .filter((d: Document) => d._id !== id && d.isPublished)
          .slice(0, 5);

        setRelatedDocs(related);
      } catch (error) {
        console.error("Failed to fetch document", error);
      }
    };

    fetchDocumentAndRelated();
  }, [id]);

  if (!document)
    return <p className="text-center mt-20">Loading document...</p>;

  return (
    <div className="flex mt-40 justify-center gap-10 p-4 mx-auto items-start w-11/12">
      {/* Main content */}
      <div className="w-4/5 flex flex-col gap-6">
        {document.bannerImage && (
          <Image
            src={document.bannerImage}
            alt={document.name}
            width={800}
            height={400}
            className="rounded-t-lg h-60 object-cover object-center"
          />
        )}
        <h1 className="text-3xl font-bold">{document.name}</h1>
        <Contents content={document.description || "No description"} />
        <hr className="border-gray-300" />

        <Button
          btnText="Download Now"
          type="button"
          tertiary
          className="max-w-40"
          onClickFunction={() => window.open(document.fileUrl, "_blank")}
        />
      </div>

      {/* Sidebar */}
      <RelevantLinks
        heading="More Documents"
        items={relatedDocs.map((d) => ({
          _id: d._id,
          name: d.name,
          type: "document",
        }))}
      />
    </div>
  );
};

export default DocumentViewPage;
