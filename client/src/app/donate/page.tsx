"use client";
import React, { useEffect, useState } from "react";
import DropDown from "../components/DropDown";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import Title from "../components/Title";

type Ways = {
  _id: string;
  cause: string;
  causeDescription: string;
};

const DonatePage = () => {
  const [ways, setWays] = useState<Ways[]>([]);
  const [anon, setAnon] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donations, setDonations] = useState<{ [wayId: string]: number }>({});
  const [total, setTotal] = useState(0);

  const fetchAllWays = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DONATION_API_URL}/all-ways`,
      { credentials: "include" }
    );
    const data = await res.json();
    setWays(data.waysToDonate);
  };

  useEffect(() => {
    fetchAllWays();
  }, []);

  const handleAdd = (wayId: string, amount: number) => {
    const updated = { ...donations, [wayId]: amount };
    setDonations(updated);
    setTotal(Object.values(updated).reduce((a, b) => a + b, 0));
  };

  const handleRemove = (wayId: string) => {
    const updated = { ...donations };
    delete updated[wayId];
    setDonations(updated);
    setTotal(Object.values(updated).reduce((a, b) => a + b, 0));
  };

  const handleDonate = async () => {
    for (const [wayId, amount] of Object.entries(donations)) {
      await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/donated/${wayId}`,
        {
          method: "POST",
          body: JSON.stringify({
            donorName: anon ? undefined : donorName,
            donorEmail: anon ? undefined : donorEmail,
            amount,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    alert(" Donations submitted!");
  };

  return (
    <div className="mt-40 min-h-screen h-full w-4/5 mx-auto flex flex-col gap-3">
      <Title text="Make a Donation Online" />
      <p className="ml-3 text-pretty">
        Give Your Zakat, Sadaqah and General Donations today through your
        Debit/Credit Card, JazzCash, Easypaisa & Bank ATM Card
      </p>

      <div className="flex items-center gap-5">
        <label htmlFor="anon" className="text-lg font-semibold">
          Stay Anonymous?
        </label>
        <input
          type="checkbox"
          name="anon"
          checked={anon}
          onChange={() => setAnon(!anon)}
          className="w-5 h-5"
        />
      </div>

      {!anon && (
        <div className="mt-5">
          <h2 className="text-3xl font-bold text-gray-700 ">
            Kindly enter your details below
          </h2>
          <div className="my-4 flex flex-col gap-5 ">
            <div className="flex gap-10 w-full">
              <InputField
                label="Enter your Name"
                name="donorName"
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
              <InputField
                label="Enter your email"
                name="donorEmail"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-700 ">
        Please Select Cause(s) for Donation
      </h2>

      <div className="mt-5">
        {ways.map((way) => (
          <DropDown
            key={way._id}
            wayId={way._id}
            cause={way.cause}
            amount={donations[way._id] || 0}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        ))}

        <hr className="my-4 text-gray-400" />
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-semibold  text-gray-700">Grand Total</h3>
          <div>
            <p className="text-base font-semibold">
              PKR <span>{total}</span>
            </p>
            <Button
              btnText="Donate Now"
              type="button"
              onClickFunction={handleDonate}
              primary
              className="max-w-60 mt-5 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
