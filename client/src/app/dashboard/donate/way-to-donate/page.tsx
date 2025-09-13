"use client";
import { Button } from "@/app/components/Button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Contents from "@/app/components/Contents";
import Loader from "@/app/components/Loader";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import Title from "@/app/components/Title";
type AccountForm = {
  id: string;
  title: string;
  IBAN: string;
  branch: string;
  swift: string;
  bankIconFile?: File | null;
  bankIconUrl?: string | null;
};

type WaysToDonate = {
  _id: string;
  bankingType:
    | "online_banking"
    | "bank_transfer"
    | "home_collection"
    | "international";
  cause: string;
  causeDescription: string;
  accounts?: AccountForm[];
  accountsParagraph?: string;
};

const WaysToDonateDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [waysToDonate, setWaysToDonate] = useState<WaysToDonate[]>([]);
  const [bannerImage, setBannerImage] = useState<string>("");

  const fetchAllWaysToDonate = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DONATION_API_URL}/all-ways`
    );
    const data = await res.json();
    console.log("data from dashboard way", data.waysToDonate);

    setWaysToDonate(data.waysToDonate);
    setLoading(false);
  };
  const fetchBannerImage = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DONATION_API_URL}/banner`
    );
    const data = await res.json();

    setBannerImage(data.bannerImage?.[0]?.bannerImage || "");
  };
  useEffect(() => {
    fetchAllWaysToDonate();
    fetchBannerImage();
  }, []);

  const onNewClick = () => {
    router.push(`/dashboard/donate/way-to-donate/create`);
  };
  const onViewClick = (id: string) => {
    router.push(`/dashboard/donate/way-to-donate/${id}`);
  };
  const onEditClick = (id: string) => {
    router.push(`/dashboard/donate/way-to-donate/edit/${id}`);
  };
  const onDeleteBannerImage = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_DONATION_API_URL}/banner`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchBannerImage();
  };

  const onDeleteWay = async (id: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_DONATION_API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchAllWaysToDonate();
    setLoading(false);
  };
  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-start w-full mt-5 ">
        <Title text="All Ways to Donate" />
        <div className="flex gap-3 items-center">
          <Button
            type="button"
            btnText="Add new Way"
            secondary={true}
            onClickFunction={() => onNewClick()}
          />
          {!bannerImage && (
            <Button
              type="button"
              btnText="Add New Banner"
              tertiary={true}
              onClickFunction={() =>
                router.push(`/dashboard/donate/way-to-donate/banner/create`)
              }
            />
          )}
        </div>
      </div>

      {bannerImage && (
        <div className="w-4/5 m-auto relative">
          <Image
            src={bannerImage}
            alt="Ways-to-Donate"
            width={800}
            height={200}
            className="rounded-md mb-3 w-full"
          />
          <div className="flex absolute top-5 right-5 gap-3 bg-gray-800 rounded p-3">
            <span
              onClick={() =>
                router.push(`/dashboard/donate/way-to-donate/banner/edit`)
              }
              className="cursor-pointer text-green-600 hover:text-green-800"
            >
              <MdEdit className="w-8 h-8" />
            </span>
            <span
              onClick={() => onDeleteBannerImage()}
              className="cursor-pointer text-red-600 hover:text-red-800"
            >
              <FaTrash className="w-7 h-7" />
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10 rounded-md">
            <tr className="bg-gray-300">
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Banking Type
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Cause of Donation
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Details about Cause
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Payment types (Acceptable types)
              </th>

              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Edit
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {waysToDonate.length > 0 ? (
              waysToDonate.map((way) => (
                <tr key={way._id} className="max-h-60">
                  <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                    {way.bankingType === "home_collection" && (
                      <p>Home Collection</p>
                    )}
                    {way.bankingType === "bank_transfer" && (
                      <p>Bank Transfer</p>
                    )}
                    {way.bankingType === "international" && (
                      <p>International Bank</p>
                    )}
                    {way.bankingType === "online_banking" && (
                      <p>Online Banking</p>
                    )}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                    {way.cause}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                    <Contents shortened={true} content={way.causeDescription} />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    {way.accounts && way.accounts.length > 0 ? (
                      <ul className=" space-y-1">
                        {way.accounts.map((acc, idx) => (
                          <li key={acc.id || idx} className="capitalize">
                            {acc.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Contents
                        shortened={true}
                        content={way.accountsParagraph || ""}
                      />
                    )}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    <Button
                      type="button"
                      btnText="View"
                      secondary={true}
                      onClickFunction={() => onViewClick(way._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    <Button
                      type="button"
                      btnText="Edit"
                      tertiary={true}
                      onClickFunction={() => onEditClick(way._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    <Button
                      type="button"
                      btnText="Delete"
                      primary={true}
                      onClickFunction={() => onDeleteWay(way._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No donation methods found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaysToDonateDashboard;
