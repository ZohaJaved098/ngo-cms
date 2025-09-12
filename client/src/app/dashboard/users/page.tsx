"use client";

// import { useSelector } from "react-redux";

// import { RootState } from "@/app/redux/store";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_USER_API_URL}/admin/all-users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchAllUsers();
  }, []);

  const onNewClick = () => {
    router.push("/dashboard/users/create");
  };
  const onViewClick = (id: string) => {
    router.push(`/dashboard/users/${id}`);
  };
  const onDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await res.json();
    if (res.ok) {
      // remove user from state immediately
      setUsers((prev) => prev.filter((user) => user._id !== id));
    }
    setLoading(false);
  };

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

    setLoading(true);
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
    console.log(data);

    // refresh after update
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, role: data.updatedUser.role } : user
      )
    );

    setLoading(false);
  };

  if (loading) <Loader />;
  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5 ">
        <h3 className="text-xl font-semibold">All Users</h3>
        <Button
          type="button"
          btnText="Add new Admin"
          secondary={true}
          onClickFunction={onNewClick}
          className="max-w-40"
        />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10 rounded-md">
            <tr className="bg-gray-300">
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Role
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Promote/Demote
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-400 px-4 py-2 max-w-52 capitalize ">
                  {user.username}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-52  ">
                  {user.email}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize">
                  {user.role}
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="View"
                    secondary={true}
                    onClickFunction={() => onViewClick(user._id)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText={getBtnText(user.role)}
                    tertiary={true}
                    onClickFunction={() => onRoleChange(user._id, user.role)}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="Delete"
                    primary={true}
                    onClickFunction={() => onDelete(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
