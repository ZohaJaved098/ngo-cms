import { FaChevronRight } from "react-icons/fa6";
type Item = {
  _id: string;
  name: string;
  type: "blog" | "event";
};

type Props = {
  items: Item[];
  heading: string;
};
import Link from "next/link";

const RelevantLinks = ({ items, heading }: Props) => {
  return (
    <div className="flex flex-col w-full md:w-1/4 gap-4">
      <h2 className="text-2xl text-left font-bold ">{heading}</h2>
      <hr className="border-gray-300" />

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No more content found.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item._id}>
              <Link
                href={`/${item.type}s/${item._id}`}
                className=" text-gray-500 font-semibold text-lg hover:text-blue-700 flex w-full items-center justify-start gap-3 "
              >
                <FaChevronRight className="w-5 h-5" />
                <p>
                  {item.name.length > 40
                    ? item.name.slice(0, 40) + "..."
                    : item.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RelevantLinks;
