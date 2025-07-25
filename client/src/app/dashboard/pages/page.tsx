"use client";
import { Button } from "@/app/components/Button";
import React from "react";

const Pages = () => {
  const onNewClick = () => {
    console.log("New button is Clicked");
  };
  const onViewClick = () => {
    console.log("View button is Clicked");
  };
  const onEditClick = () => {
    console.log("Edit button is Clicked");
  };
  const onPublishToggle = () => {
    console.log("Publish button is Clicked");
  };
  return (
    <div className="flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Pages</h3>
        <Button
          type="button"
          btnText="New Page"
          secondary={true}
          onClickFunction={onNewClick}
          className="max-w-40"
        />
      </div>
      <table className="w-full table-auto border border-gray-300 text-sm text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Slug</th>
            <th className="border border-gray-300 px-4 py-2">Parent/Child</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">View</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
            <th className="border border-gray-300 px-4 py-2">Toggle Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2">About Us</td>
            <td className="border border-gray-400 px-4 py-2">/about-us</td>
            <td className="border border-gray-400 px-4 py-2">/</td>
            <td className="border border-gray-400 px-4 py-2">
              About us: we are great!
            </td>
            <td className="border border-gray-400 px-4 py-2 text-red-500">
              Unpublished
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <Button
                type="button"
                btnText="View"
                secondary={true}
                onClickFunction={onViewClick}
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <Button
                type="button"
                btnText="Edit"
                tertiary={true}
                onClickFunction={onEditClick}
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <Button
                type="button"
                btnText="Publish"
                primary={true}
                onClickFunction={onPublishToggle}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Pages;
