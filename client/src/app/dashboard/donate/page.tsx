"use client";

import { Button } from "@/app/components/Button";
import React from "react";
import { useRouter } from "next/navigation";
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
      <div className="w-4/5 mt-10 m-auto">
        Table to show total number of causes to donate to and how much is
        donated.
      </div>
    </div>
  );
};

export default Donation;
