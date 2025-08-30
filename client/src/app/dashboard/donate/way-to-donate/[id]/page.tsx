"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Image from "next/image";
import Contents from "@/app/components/Contents";

type BankingType =
  | "online_banking"
  | "bank_transfer"
  | "home_collection"
  | "international"
  | "";

type AccountForm = {
  id: string;
  title: string;
  IBAN: string;
  branch: string;
  swift: string;
  bankIcon?: string | null;
};

type WaysToDonate = {
  _id?: string;
  bankingType: BankingType;
  cause: string;
  causeDescription: string;
  useAccounts: boolean;
  accounts: AccountForm[];
  accountsParagraph?: string;
};

const ViewWay: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [way, setWay] = useState<WaysToDonate>();
  const { id } = useParams();

  useEffect(() => {
    const fetchWay = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DONATION_API_URL}/${id}`
        );
        const data = await res.json();

        if (res.ok) {
          setWay({
            ...data.way,
            useAccounts: data.way.accounts?.length > 0,
          });
        }
      } catch (err) {
        console.error("Error fetching way:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWay();
  }, [id]);

  const onEditClick = () => {
    router.push(`/dashboard/donate/way-to-donate/edit/${id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <h1 className="font-bold text-3xl">View {way?.cause}</h1>

      <div className="w-3/4 flex justify-between items-start">
        <div>
          <label className="font-semibold">Banking Type</label>
          <div>
            {way?.bankingType === "home_collection" && <p>Home Collection</p>}
            {way?.bankingType === "bank_transfer" && <p>Bank Transfer</p>}
            {way?.bankingType === "international" && <p>International Bank</p>}
            {way?.bankingType === "online_banking" && <p>Online Banking</p>}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Cause for this Donation:</h3>
          <p>{way?.cause}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="causeDescription">Description of Cause</label>
        <Contents content={way?.causeDescription || ""} />
      </div>

      {way?.useAccounts && way.accounts?.length > 0 ? (
        <div>
          {way.accounts.map((acc, i) => (
            <div
              key={acc.id || i}
              className="p-3 border border-gray-300 rounded-md shadow-lg mb-3"
            >
              {acc.bankIcon && (
                <div className="mt-2 flex items-center gap-4">
                  <Image
                    src={acc.bankIcon}
                    alt="bank icon"
                    className="h-20 w-20 object-contain"
                    width={55}
                    height={55}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-3">
                {acc.title && (
                  <div>
                    <h3 className="font-semibold">Account Title</h3>
                    <p>{acc.title}</p>
                  </div>
                )}
                {acc.IBAN && (
                  <div>
                    <h3 className="font-semibold">IBAN</h3>
                    <p>{acc.IBAN}</p>
                  </div>
                )}
                {acc.branch && (
                  <div>
                    <h3 className="font-semibold">Branch</h3>
                    <p>{acc.branch}</p>
                  </div>
                )}
                {acc.swift && (
                  <div>
                    <h3 className="font-semibold">Swift</h3>
                    <p>{acc.swift}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <label className="font-semibold">Accounts Paragraph</label>
          <Contents content={way?.accountsParagraph || ""} />
        </div>
      )}

      <div className="flex justify-between mt-5">
        <Button
          type="button"
          btnText="Edit"
          onClickFunction={onEditClick}
          tertiary
          className="max-w-32"
        />
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={() => router.push("/dashboard/donate/way-to-donate")}
          primary
          className="max-w-32"
        />
      </div>
    </div>
  );
};

export default ViewWay;
