"use client";

import { Button } from "@/app/components/Button";
import React from "react";
import { useRouter } from "next/navigation";
import Chart from "@/app/components/Chart";
import Card from "@/app/components/Card";
const Donation = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full py-10  ">
      <h3 className="text-3xl text-gray-600 font-semibold">
        Donation Informations
      </h3>
      <div className="flex justify-between gap-10 flex-wrap sm:flex-nowrap items-center mt-5 w-4/5 m-auto">
        <Button
          type="button"
          btnText="View all ways to Donate"
          tertiary={true}
          onClickFunction={() => router.push("/dashboard/donate/way-to-donate")}
        />
        <Button
          type="button"
          btnText="View all donations made"
          secondary={true}
          onClickFunction={() => router.push("/dashboard/donate/donated")}
        />
      </div>

      <div className="w-4/5 h-fit m-auto mt-10 flex flex-col gap-5  ">
        <div className="flex flex-wrap items-center justify-start gap-5">
          <Card title="Donation Made" amount={3000} money />
          <Card title="No. of Causes" amount={6} />
          <Card title="No. of Ways to Donate" amount={6} />
          <Card title="No. of Accounts Added" amount={7} />
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
              labels: [
                "Bank Transfer",
                "Online Banking",
                "International",
                "Home Collection",
              ],
              datasets: [
                {
                  data: [10, 5, 3, 8],
                  //demo data for now. here its supposed to be total causes in each type of banking
                  backgroundColor: ["#f87171", "#34d399", "#60a5fa", "#ffffab"],
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
