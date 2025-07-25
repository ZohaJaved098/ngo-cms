"use client";

// import { useSelector } from "react-redux";

// import { RootState } from "@/app/redux/store";
import { Button } from "@/app/components/Button";
// import { useEffect } from "react";
const Blogs = () => {
  // const user = useSelector((state: RootState) => state.auth.user); //current user
  const onNewClick = () => {
    console.log("New button is Clicked");
  };
  const onViewClick = () => {
    {
      /* view blog detail */
    }
    console.log("View button is Clicked");
  };
  const onEditClick = () => {
    // edit blog
    console.log("Edit button is Clicked");
  };
  const onPublish = () => {
    //delete blog
    console.log("Publish button is Clicked");
  };
  const onDelete = () => {
    //delete blog
    console.log("Delete button is Clicked");
  };
  //   useEffect(() => {
  // to get all Blogs from db
  //     const Blogs = await fetch;
  //   });
  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5 ">
        <h3 className="text-xl font-semibold">All Blogs</h3>
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
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Content
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Author
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Tags
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Published on
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Edit
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Publish
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                My blog
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                tech
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                actual review of blog content
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                Zoha Javed
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-40 ">
                <ul className="flex flex-wrap gap-2">
                  <li className="bg-cyan-600 text-white rounded-2xl py-2 px-3 ">
                    Tag1
                  </li>
                  <li className="bg-cyan-600 text-white rounded-2xl py-2 px-3 ">
                    Tag2
                  </li>
                  <li className="bg-cyan-600 text-white rounded-2xl py-2 px-3 ">
                    Tag3
                  </li>
                </ul>
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                25th Jul 25
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="View"
                  secondary={true}
                  onClickFunction={onViewClick}
                />
              </td>
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
                  btnText="Publish"
                  primary={true}
                  onClickFunction={onPublish}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28">
                <Button
                  type="button"
                  btnText="Delete"
                  primary={true}
                  onClickFunction={onDelete}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
