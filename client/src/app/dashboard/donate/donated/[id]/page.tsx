"use client";
import { Button } from "@/app/components/Button";
import Contents from "@/app/components/Contents";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type Account = {
  bankIcon: string;
  title: string;
  IBAN: string;
  branch: string;
  swift: string;
};

type Way = {
  _id: string;
  bankingType: string;
  cause: string;
  causeDescription: string;
  accounts: Account[];
};

type Donation = {
  _id: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  donateStatus: string;
  way: Way;
};

const DonatedInformation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [donation, setDonation] = useState<Donation | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchADonated = async () => {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/donated/${id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      setDonation(data.donation);

      setLoading(false);
    };
    fetchADonated();
  }, [id]);
  const onCancelClick = () => {
    router.push(`/dashboard/donate/donated`);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/donated/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setDonation(data.donation);
      } else {
        console.error("Failed to update status", data.message);
      }
    } catch (error) {
      console.error("Error updating status", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !donation) return <Loader />;

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title
        text={`View ${donation.way?.cause}'s Donation by ${donation.donorName}`}
      />

      <div className=" flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <label className="font-semibold text-xl">Banking Type:</label>
          <div>
            {donation.way?.bankingType === "home_collection" && (
              <p>Home Collection</p>
            )}
            {donation.way?.bankingType === "bank_transfer" && (
              <p>Bank Transfer</p>
            )}
            {donation.way?.bankingType === "international" && (
              <p>International Bank</p>
            )}
            {donation.way?.bankingType === "online_banking" && (
              <p>Online Banking</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <h3 className="font-semibold text-xl">Cause for this Donation:</h3>
          <p>{donation.way?.cause}</p>
        </div>
      </div>
      <div className=" flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-xl">Donor Informations</label>
          <p>
            Name:
            <span>{donation.donorName ? donation.donorName : "Anonymous"}</span>
          </p>
          <div className="flex gap-3 items-center">
            <h3 className="font-semibold text-xl">Amount Donated:</h3>
            <p>PKR {donation.amount}/-</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <h3 className="font-semibold text-xl">Status:</h3>
          <p
            className={`capitalize font-semibold text-lg ${
              (donation.donateStatus === "confirmed" && "text-green-600") ||
              (donation.donateStatus === "pending" && "text-gray-700") ||
              (donation.donateStatus === "failed" && "text-red-700")
            }`}
          >
            {donation.donateStatus}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="causeDescription" className="font-semibold text-xl">
          Description of Cause
        </label>
        <Contents content={donation.way?.causeDescription || ""} />
      </div>

      <div className="flex justify-between mt-5">
        <div className="flex gap-5">
          <Button
            type="button"
            btnText="Edit Status to Confirmed"
            onClickFunction={() => handleStatusUpdate("confirmed")}
            tertiary
          />
          <Button
            type="button"
            btnText="Edit Status to Failed"
            onClickFunction={() => handleStatusUpdate("failed")}
            secondary
          />
        </div>
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={onCancelClick}
          primary
        />
      </div>
    </div>
  );
};

export default DonatedInformation;
