"use client";

import { Button } from "@/app/components/Button";
// import { useEffect, useState } from "react";
import Image from "next/image";
const ImageSlider = () => {
  const onNewClick = () => {
    console.log("New button is Clicked");
  };
  const onViewClick = () => {
    {
      /* view user detail */
    }
    console.log("View button is Clicked");
  };
  const onEditClick = () => {
    // edit image
    console.log("Edit button is Clicked");
  };
  const onDelete = () => {
    //delete image
    console.log("Delete button is Clicked");
  };
  //   useEffect(() => {
  //     const fetchAllImageSlider = async () => {
  //       try {
  //         const response = await fetch(
  //           `${process.env.NEXT_PUBLIC_USER_API_URL}/admin/all-ImageSlider`,
  //           {
  //             method: "GET",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             credentials: "include",
  //           }
  //         );
  //         const data = await response.json();
  //         setImageSlider(data.ImageSlider);
  //       } catch (error) {
  //         console.error("Failed to fetch ImageSlider", error);
  //       }
  //     };

  //     fetchAllImageSlider();
  //   }, []);

  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5 ">
        <h3 className="text-xl font-semibold">
          Images for Slider in Home Page
        </h3>
        <Button
          type="button"
          btnText="Add new Image"
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
                Image
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Title
              </th>
              {/* <th className="border border-gray-300 px-4 py-2 max-w-28">
                Role
              </th> */}
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Change Image
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {ImageSlider.map((user) => ( */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 max-w-52 capitalize ">
                <Image src={""} alt="" width={100} height={100} />
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-52  ">
                Title
              </td>
              <td className="border border-gray-400 px-4 py-2 min-w-20">
                <Button
                  type="button"
                  btnText="View"
                  secondary={true}
                  onClickFunction={onViewClick}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 min-w-20">
                <Button
                  type="button"
                  btnText="Edit"
                  tertiary={true}
                  onClickFunction={onEditClick}
                />
              </td>
              <td className="border border-gray-400 px-4 py-2 min-w-20">
                <Button
                  type="button"
                  btnText="Delete"
                  primary={true}
                  onClickFunction={onDelete}
                />
              </td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImageSlider;
