"use client";
import { Button } from "@/app/components/Button";
import React from "react";

const Events = () => {
  const onViewClick = () => {
    {
      /* view event detail */
    }
    console.log("View button is Clicked");
  };
  const onEditClick = () => {
    // edit event
    console.log("Edit button is Clicked");
  };
  const onDelete = () => {
    //delete event
    console.log("Delete button is Clicked");
  };
  return (
    <div className="flex flex-col gap-10 max-h-screen h-full w-full">
      <div className="flex justify-between items-center w-full mt-5 ">
        <h3 className="text-xl font-semibold">All Events</h3>
        <Button
          type="button"
          btnText="Add new Event"
          secondary={true}
          onClickFunction={() => {}}
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
                Event Type
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Guest Speakers
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Venue Type
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Location
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Date & Time{" "}
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Registered Audience
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Status
              </th>
              {/* status could be complete, ongoing or cancelled */}
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                View
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Edit
              </th>
              <th className="border border-gray-300 px-4 py-2 max-w-28">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                Event name
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 capitalize ">
                Fundraising
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                <p className="truncate whitespace-nowrap max-w-28">
                  Short Description about the event Short Description about the
                  event
                </p>
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28  ">
                <ul>
                  <li>Guest Speaker #1</li>
                  <li>Guest Speaker #2</li>
                  <li>Guest Speaker #3</li>
                </ul>
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28  ">
                Marquee{" "}
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28  ">
                Location {/* should be a map or pin location link */}
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                25 Jul,2025 & 7.00pm
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                500
              </td>
              <td className="border border-gray-400 px-4 py-2 max-w-28 ">
                Ongoing
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
                  btnText="Delete User"
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

export default Events;
