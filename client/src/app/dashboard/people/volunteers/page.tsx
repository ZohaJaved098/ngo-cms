"use client";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RxSlash } from "react-icons/rx";
type Volunteer = {
  _id: string;
  name: string;
  email: string;
  motivation?: string;
  status: "pending" | "accepted" | "rejected";
};

const VolunteerDashboard = () => {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_VOLUNTEER_API_URL}`, {
        credentials: "include",
      });
      const data = await res.json();
      setVolunteers(data.volunteers || []);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    } finally {
      setLoading(false);
    }
  };

  const onEditClick = async (id: string, status: "accepted" | "rejected") => {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_VOLUNTEER_API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      fetchVolunteers();
    } catch (err) {
      console.error("Error updating volunteer:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteClick = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_VOLUNTEER_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchVolunteers();
    } catch (err) {
      console.error("Error deleting Volunteer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-start w-full mt-5">
        <Title text="All Applications" />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10 rounded-md">
            <tr className="bg-gray-300">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Motivation</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <tr key={volunteer._id}>
                  <td className="border px-4 py-2">{volunteer.name}</td>
                  <td className="border px-4 py-2">{volunteer.email}</td>
                  <td className="border px-4 py-2">
                    {volunteer.motivation || <p className="text-xl">-</p>}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {volunteer.status === "pending" ? (
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          btnText="Accept"
                          type="button"
                          tertiary
                          onClickFunction={() =>
                            onEditClick(volunteer._id, "accepted")
                          }
                        />
                        <RxSlash className="w-5 h-10" />
                        <Button
                          btnText="Reject"
                          type="button"
                          primary
                          onClickFunction={() =>
                            onEditClick(volunteer._id, "rejected")
                          }
                        />
                      </div>
                    ) : (
                      <Button
                        btnText={
                          volunteer.status === "accepted"
                            ? "Accepted"
                            : "Rejected"
                        }
                        type="button"
                        tertiary={volunteer.status === "accepted"}
                        primary={volunteer.status === "rejected"}
                        disabled
                        onClickFunction={() => {}}
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <Button
                      btnText="Delete"
                      type="button"
                      primary
                      onClickFunction={() => onDeleteClick(volunteer._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Volunteers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
