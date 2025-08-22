import React from "react";

const colors = [
  "bg-red-500/70",
  "bg-blue-500/70",
  "bg-green-500/70",
  "bg-purple-500/70",
  "bg-pink-500/70",
  "bg-yellow-500/70",
  "bg-orange-500/70",
  "bg-teal-500/70",
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
};

const Card = ({ title, amount }: CardProps) => {
  return (
    <div
      className={`shadow-xl ${getColorForLabel(
        title
      )} text-white min-w-40 max-w-fit p-5 flex gap-5 flex-col items-center justify-center rounded-lg`}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <span className="text-3xl tracking-widest">{amount}</span>
    </div>
  );
};

export default Card;
