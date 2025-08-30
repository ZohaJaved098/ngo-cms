"use client";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type Donations = {
  _id: string;
  donorName: string;
  amount: number;
  way: Way;
  donorEmail: string;
};
type Way = {
  _id: string;
  bankingType: string;
  cause: string;
  causeDescription: string;
};
const DonatedDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [donations, setDonations] = useState<Donations[]>([]);

  const fetchAllDonated = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DONATION_API_URL}/donated`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();

    console.log("data for donation", data);
    setDonations(data.donations);

    setLoading(false);
  };
  useEffect(() => {
    fetchAllDonated();
  }, []);
  const onViewClick = (id: string) => {
    router.push(`/dashboard/donate/donated/${id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-xl font-semibold">Donation Made</h3>
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
                Donor Information
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Amount Donated
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <tr key={donation._id} className="max-h-60">
                  <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                    {donation.way?.bankingType || "-"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                    {donation.way?.cause || "-"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    {donation.donorName ? donation.donorName : "Anonymous"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    {donation.amount}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 max-w-28">
                    <Button
                      type="button"
                      btnText="View"
                      secondary
                      onClickFunction={() => onViewClick(donation._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
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

export default DonatedDashboard;
