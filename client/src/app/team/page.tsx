"use client";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Image from "next/image";
import Title from "../components/Title";
type Teams = {
  _id: string;
  name: string;
  role: string;
  memberPic: string;
};
const Team = () => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Teams[]>([]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_TEAM_API_URL}`, {
        credentials: "include",
      });
      const data = await res.json();
      setTeams(data.team || []);
    } catch (err) {
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-4/5 h-screen m-auto mt-40">
      <Title text="Meet our Team!" />
      <div className="flex gap-5 flex-wrap items-start ">
        {teams.map((team) => (
          <div
            key={team._id}
            className="flex flex-col gap-10 min-w-2xs sm:flex items-center justify-center border-2 border-blue-800 p-5 rounded shadow-2xl"
          >
            <div>
              <Image
                src={team.memberPic}
                alt={team.name}
                width={100}
                height={100}
                className="object-cover border border-gray-700 rounded-full w-32 h-32"
              />
            </div>
            <div className="flex flex-col gap-5 items-center my-3">
              <p className="text-2xl font-black text-blue-600">{team.name}</p>
              <span className="text-xl text-blue-500 font-semibold">
                {team.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
