"use client";

// import { useSelector } from "react-redux";

// import { RootState } from "@/app/redux/store";
import { Button } from "@/app/components/Button";
import { useEffect, useState } from "react";
type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  const onNewClick = () => {
    console.log("New button is Clicked");
  };
  // const onViewClick = () => {
  //   {
  //     /* view user detail */
  //   }
  //   console.log("View button is Clicked");
  // };
  const onEditClick = () => {
    // edit user info like name or role
    console.log("Edit button is Clicked");
  };
  const onDelete = () => {
    //delete user or deny access admin can delete user or manager
    console.log("Delete button is Clicked");
  };
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
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
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5 ">
        <h3 className="text-xl font-semibold">All Users</h3>
        <Button
          type="button"
          btnText="Add new Manager"
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
              {/* <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th> */}
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Edit Role
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
                {/* <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="View"
                    secondary={true}
                    onClickFunction={onViewClick}
                  />
                </td> */}
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="Edit"
                    tertiary={true}
                    onClickFunction={onEditClick}
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 max-w-28">
                  <Button
                    type="button"
                    btnText="Delete User"
                    primary={true}
                    onClickFunction={onDelete}
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
