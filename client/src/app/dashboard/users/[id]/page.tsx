"use client";
import { Button } from "@/app/components/Button";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};
const ViewUser = () => {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    role: "",
    _id: "",
  });
  const router = useRouter();
  const { id } = useParams();
  const onCancelClick = () => {
    router.push("/dashboard/users");
  };
  useEffect(() => {
    const fetchAUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_USER_API_URL}/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAUser();
  }, [id]);

  const getBtnText = (role: string) => {
    if (role === "admin") return "-";
    if (role === "manager") return "Demote";
    if (role === "user") return "Promote";
    return "";
  };
  const onRoleChange = async (id: string, currentRole: string) => {
    let newRole = currentRole;
    if (currentRole === "manager") newRole = "user";
    else if (currentRole === "user") newRole = "manager";
    else return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_USER_API_URL}/${id}/role`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
        credentials: "include",
      }
    );

    const data = await res.json();
    console.log(data.user);
  };
  return (
    <div className="w-4/5 mt-10 m-auto flex flex-col items-start gap-5">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-black text-3xl">User Information:</h1>
      </div>
      <div className="flex items-start w-full justify-between">
        <div className="flex flex-col justify-between items-start gap-5">
          <div className="flex gap-10 items-center">
            <h1 className="font-semibold text-gray-700 text-lg">User Name:</h1>
            <p className="font-medium text-base text-blue-600 ">
              {user.username}
            </p>
          </div>
          <div className="flex gap-10 items-center">
            <h1 className="font-semibold text-gray-700 text-lg ">
              User Email:
            </h1>
            <p className="font-medium text-base text-blue-600">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <p className="text-xl font-semibold capitalize  ">{user.role}</p>
          {user.role !== "admin" && (
            <Button
              btnText={getBtnText(user.role)}
              secondary={true}
              type="button"
              className="max-w-32"
              onClickFunction={() => onRoleChange(user._id, user.role)}
            />
          )}
        </div>
      </div>
      <hr className="w-full text-gray-700 my-10" />
      <Button
        type="button"
        primary={true}
        btnText="Go Back"
        className="max-w-32 flex self-end "
        onClickFunction={onCancelClick}
      />
    </div>
  );
};

export default ViewUser;
