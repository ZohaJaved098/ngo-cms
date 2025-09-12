import React from "react";

const colors = [
  "bg-amber-500/70",
  "bg-blue-500/70",
  "bg-black-500/70",
  "bg-cyan-500/70",
  "bg-emerald-500/70",
  "bg-fuchsia-500/70",
  "bg-gray-500/70",
  "bg-green-500/70",
  "bg-orange-500/70",
  "bg-purple-500/70",
  "bg-pink-500/70",
  "bg-red-500/70",
  "bg-rose-500/70",
  "bg-teal-500/70",
  "bg-yellow-500/70",
];

function getColorForLabel(label: string) {
  const index = label
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

type CardProps = {
  title: string;
  amount?: number;
  money?: boolean;
};

const Card = ({ title, amount, money }: CardProps) => {
  return (
    <div
      className={`  shadow-xl ${getColorForLabel(
        title
      )} text-white min-w-40 max-w-fit p-5 flex gap-5 flex-col items-center justify-center rounded-lg`}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <span
        className={` ${
          money && "text-green-900"
        } text-xl tracking-widest flex gap-3`}
      >
        {money && <p className="font-semibold">PKR:</p>}
        {amount}
      </span>
    </div>
  );
};

export default Card;
