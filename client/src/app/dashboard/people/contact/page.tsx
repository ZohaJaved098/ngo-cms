"use client";
import { Button } from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Title from "@/app/components/Title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Contact = {
  _id: string;
  type: "email" | "phone" | "social";
  value: string;
  contactIcon: string;
};

const ContactsDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CONTACT_API_URL}`, {
        credentials: "include",
      });
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const onNewClick = () => {
    router.push("/dashboard/people/contact/create");
  };

  const onEditClick = (id: string) => {
    router.push(`/dashboard/people/contact/edit/${id}`);
  };

  const onDeleteClick = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_CONTACT_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-start w-full mt-5">
        <Title text="All Contacts" />
        <Button
          type="button"
          btnText="Add new Contact"
          secondary={true}
          onClickFunction={onNewClick}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-max table-auto border border-gray-300 text-sm text-left">
          <thead className="sticky top-0 z-10 rounded-md">
            <tr className="bg-gray-300">
              <th className="border border-gray-300 px-4 py-2">Icon</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
              <th className="border border-gray-300 px-4 py-2">Edit</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact._id}>
                  <td className="border border-gray-400 px-4 py-2 capitalize">
                    <Image
                      src={contact.contactIcon || ""}
                      alt={contact.type}
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 capitalize">
                    {contact.type}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {contact.value}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    <Button
                      btnText="Edit"
                      type="button"
                      secondary
                      onClickFunction={() => onEditClick(contact._id)}
                    />
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    <Button
                      btnText="Delete"
                      type="button"
                      primary
                      onClickFunction={() => onDeleteClick(contact._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsDashboard;
