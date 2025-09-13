"use client";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Teams = {
  _id: string;
  name: string;
  role: string;
  memberPic: string;
};

const TeamDashboard = () => {
  const router = useRouter();
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

  const onNewClick = () => {
    router.push("/dashboard/people/teams/create");
  };

  const onEditClick = (id: string) => {
    router.push(`/dashboard/people/teams/edit/${id}`);
  };

  const onDeleteClick = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_TEAM_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTeams();
    } catch (err) {
      console.error("Error deleting contact:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-start w-full mt-5">
        <Title text="All Teams" />
        <Button
          type="button"
          btnText="Add new Member"
          secondary={true}
          onClickFunction={onNewClick}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10 rounded-md">
            <tr className="bg-gray-300">
              <th className="border border-gray-300 px-4 py-2">Profile</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Edit</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <tr key={team._id}>
                  <td className="border border-gray-400 px-4 py-2 capitalize">
                    <Image
                      src={team.memberPic}
                      alt={team.name}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 capitalize">
                    {team.name}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {team.role}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    <Button
                      btnText="Edit"
                      type="button"
                      secondary
                      onClickFunction={() => onEditClick(team._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    <Button
                      btnText="Delete"
                      type="button"
                      primary
                      onClickFunction={() => onDeleteClick(team._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No team member found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamDashboard;
