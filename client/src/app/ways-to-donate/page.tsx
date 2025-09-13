"use client";
import React, { useEffect, useState } from "react";
import Contents from "../components/Contents";

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
  accounts?: Account[];
  accountsParagraph: string;
};

export default function WaysToDonate() {
  const [ways, setWays] = useState<Way[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const fetchWays = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DONATION_API_URL}/all-ways`,
      { credentials: "include" }
    );
    const data = await res.json();
    setWays(data.waysToDonate || []);

    console.log("active", data.waysToDonate.length);
    if (data.waysToDonate.length > 0) {
      setActiveTab(data.waysToDonate[0].bankingType);
    }
  };
  useEffect(() => {
    fetchWays();
  }, []);

  const groupedWays = ways.reduce<Record<string, Way[]>>((acc, way) => {
    if (!acc[way.bankingType]) acc[way.bankingType] = [];
    acc[way.bankingType].push(way);
    return acc;
  }, {});

  const bankingLabels: Record<string, string> = {
    home_collection: "Home Collection",
    bank_transfer: "Bank Transfer",
    international: "International Bank",
    online_banking: "Online Banking",
  };

  return (
    <div className="w-full max-w-5xl mt-40 mx-auto my-10">
      <div className="flex gap-4">
        {Object.keys(groupedWays).map((bankingType) => (
          <button
            key={bankingType}
            className={`px-4 py-2 w-1/4 h-14 font-semibold rounded-t-lg transition ${
              activeTab === bankingType
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(bankingType)}
          >
            {bankingLabels[bankingType] || bankingType}
          </button>
        ))}
      </div>

      {/* Content (only activeTab is shown) */}
      <div className="border border-gray-400 p-5 rounded-b-xl shadow-lg bg-white">
        {groupedWays[activeTab]?.map((way) => (
          <div key={way._id} className="mb-5 pb-4 w-4/5 m-auto">
            <div className="flex items-start flex-col gap-4">
              <h3 className="font-bold text-xl text-gray-700">{way.cause}</h3>
              {way.causeDescription && (
                <div className="flex-col">
                  <h4 className="font-semibold text-lg">Cause Description</h4>
                  <Contents content={way.causeDescription} />
                </div>
              )}
            </div>

            {/* Accounts (if any) */}
            {way.accounts && way.accounts.length > 0 ? (
              <div className="mt-2 grid sm:grid-cols-2 gap-4">
                {way.accounts.map((acc, i) => (
                  <div
                    key={i}
                    className="p-5 flex flex-col gap-1 bg-gray-200 rounded-lg"
                  >
                    <p className="font-medium ">{acc.title}</p>
                    {acc.IBAN && (
                      <div className="flex items-center gap-5">
                        <p className="text-base font-medium">IBAN:</p>
                        <p>{acc.IBAN}</p>
                      </div>
                    )}
                    {acc.branch && (
                      <div className="flex items-center gap-5">
                        <p className="text-base font-medium">Branch:</p>
                        <p>{acc.branch}</p>
                      </div>
                    )}
                    {acc.swift && (
                      <div className="flex items-center gap-5">
                        <p className="text-base font-medium">SWIFT:</p>
                        <p>{acc.swift}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-col">
                <h4 className="font-semibold text-base">Donate by:</h4>
                <Contents content={way.accountsParagraph} />
              </div>
            )}
            <hr className="w-full text-gray-400 my-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
