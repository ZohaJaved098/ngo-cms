"use client";
import { Button } from "@/app/components/Button";
import Card from "@/app/components/Card";
import Title from "@/app/components/Title";
import { useRouter } from "next/navigation";
import React from "react";

const People = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full py-10  ">
      <Title text="People" />
      <div className="flex gap-10 flex-wrap sm:flex-nowrap items-center mt-5 w-4/5 m-auto">
        <Button
          type="button"
          btnText="View all Volunteers Applications"
          tertiary={true}
          onClickFunction={() => router.push("/dashboard/people/volunteers")}
        />
        <Button
          type="button"
          btnText="View Our Team"
          secondary={true}
          onClickFunction={() => router.push("/dashboard/people/teams")}
        />
        <Button
          type="button"
          btnText="View Our Contacts"
          secondary={true}
          onClickFunction={() => router.push("/dashboard/people/contact")}
        />
      </div>

      <div className="w-4/5 h-fit m-auto mt-10 flex flex-col gap-5  ">
        <p className="text-gray-400 capitalize">these numbers are demo</p>
        <div className="flex flex-wrap items-center justify-start gap-5">
          <Card title="No. of Applications" amount={200} />
          <Card title="No. of Pending Applications" amount={100} />
          <Card title="No. of Accepted Applications" amount={100} />
          <Card title="Team Members" amount={2} />
          <Card title="No. of Ways to Contact" amount={3} />
        </div>
      </div>
    </div>
  );
};

export default People;
