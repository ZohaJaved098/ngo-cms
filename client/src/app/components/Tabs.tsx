"use client";
import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

type TabItem = {
  label: string;
  value: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
  defaultValue?: string;
};

const AppTabs: React.FC<Props> = ({ tabs, defaultValue }) => {
  return (
    <Tabs.Root
      defaultValue={defaultValue || tabs[0]?.value}
      className="w-full bg-pink-100"
    >
      {/* Tab headers */}
      <Tabs.List className="flex border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2 text-gray-500 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Tab content */}
      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="p-5">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default AppTabs;
