"use client";

import { Button } from "@/app/components/Button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Page = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
};

const ViewPage = () => {
  const [page, setPage] = useState<Page | null>(null);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    const fetchAPage = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`);
      const data = await res.json();
      setPage(data.page);
      //   console.log("fecthed data ", data.page);
    };
    fetchAPage();
  }, [id]);

  const onEditClick = (id: string) => {
    router.push(`edit/${id}`);
  };
  const onCancelClick = () => {
    router.push(`/dashboard/pages`);
  };

  const onPublishToggle = () => {
    console.log("Publish button is Clicked");
  };

  return page == null ? (
    <div className="">
      <h1>Not found! Go back to http://localhost:3000/dashboard/pages </h1>
    </div>
  ) : (
    <div className="w-4/5 mt-10 m-auto h-full flex flex-col items-start gap-5">
      <div className=" w-full flex justify-between items-center">
        <h1 className="font-black text-3xl">{page.title}</h1>
        <p className="font-light text-xl underline">{page.slug}</p>
      </div>
      <div className="flex items-center justify-between w-full ">
        <p
          className={`${
            page.status == "unpublished" ? "text-red-600" : "text-green-600"
          } capitalize text-xl font-bold `}
        >
          {page.status}
        </p>
        <Button
          btnText={`${page.status == "unpublished" ? "Publish" : "Unpublish"}`}
          secondary={true}
          type="button"
          className="max-w-20"
          onClickFunction={onPublishToggle}
        />
      </div>
      <div>
        <p>{page.content}</p>
      </div>
      <div className="flex items-center justify-between w-full">
        <Button
          type="button"
          tertiary={true}
          btnText="Edit"
          className="max-w-32 "
          onClickFunction={() => onEditClick(page._id)}
        />
        <Button
          type="button"
          primary={true}
          btnText="Go Back"
          className="max-w-32"
          onClickFunction={onCancelClick}
        />
      </div>
    </div>
  );
};

export default ViewPage;
