"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type Item = {
  title: string;
  content: string | React.ReactNode;
};

type Props = {
  items: Item[];
};

export default function CustomAccordion({ items }: Props) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="w-full rounded-lg border bg-white shadow-md"
    >
      {items.map((item, idx) => (
        <Accordion.Item
          key={idx}
          value={`item-${idx}`}
          className="border-b last:border-none"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left text-lg font-medium text-gray-700 hover:bg-gray-50">
              {item.title}
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 pb-4 text-gray-600 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
            {item.content}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
