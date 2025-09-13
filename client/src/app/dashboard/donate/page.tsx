"use client";

import { Button } from "@/app/components/Button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chart from "@/app/components/Chart";
import Card from "@/app/components/Card";
import Title from "@/app/components/Title";
import Loader from "@/app/components/Loader";
import generateColors from "@/app/util/helper";

type Way = {
  _id: string;
  bankingType: string;
  cause: string;
  causeDescription: string;
};

type Donations = {
  _id: string;
  donorName: string;
  amount: number;
  way: Way;
  donorEmail: string;
  donateStatus: string;
};

const Donation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<Donations[]>([]);

  const fetchAllDonated = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DONATION_API_URL}/donated`,
      { credentials: "include" }
    );
    const data = await res.json();
    setDonations(data.donations);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllDonated();
  }, []);

  const bankingTypeStats = donations.reduce<Record<string, number>>(
    (acc, donation) => {
      const type = donation.way.bankingType || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {}
  );

  const bankingLabels = Object.keys(bankingTypeStats);
  const bankingData = Object.values(bankingTypeStats);

  const uniqueCauses = new Set(donations.map((d) => d.way?.cause)).size;
  const uniqueWays = new Set(donations.map((d) => d.way?.bankingType)).size;
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  if (loading) return <Loader />;
  return (
    <div className="w-full h-full py-10">
      <Title text="Donation Informations" />

      <div className="flex justify-between gap-10 flex-wrap sm:flex-nowrap items-center mt-5 w-4/5 m-auto">
        <Button
          type="button"
          btnText="View all ways to Donate"
          tertiary
          onClickFunction={() => router.push("/dashboard/donate/way-to-donate")}
        />
        <Button
          type="button"
          btnText="View all donations made"
          secondary
          onClickFunction={() => router.push("/dashboard/donate/donated")}
        />
      </div>

      <div className="w-4/5 h-fit m-auto mt-10 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-start gap-5">
          <Card title="Donation Made by users" amount={donations.length} />
          <Card title="No. of Causes" amount={uniqueCauses} />
          <Card title="No. of Ways to Donate" amount={uniqueWays} />
          <Card title="Total Amount Donated" amount={totalAmount} money />
        </div>
      </div>

      <div className="w-4/5 mt-10 m-auto">
        <div className="w-4/5 h-[300px] m-auto my-5">
          <h3 className="text-gray-700 text-lg font-semibold">
            Causes in Each Banking Type:
          </h3>
          <Chart
            type="doughnut"
            data={{
              labels: bankingLabels,
              datasets: [
                {
                  data: bankingData,
                  backgroundColor: generateColors(bankingData.length),
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            className="h-fit w-fit mt-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Donation;
