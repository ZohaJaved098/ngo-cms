import React from "react";
import generateColors from "@/app/util/helper";

type CardProps = {
  title: string;
  amount?: number;
  money?: boolean;
};

const Card = ({ title, amount, money }: CardProps) => {
  const colors = generateColors(20); // make a palette of 20 unique colors

  // hash function → converts title string into a number
  function getIndexFromTitle(label: string) {
    return (
      label.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length
    );
  }

  const bgColor = colors[getIndexFromTitle(title)];

  return (
    <div
      className="shadow-xl text-white min-w-40 max-w-fit p-5 flex gap-5 flex-col items-center justify-center rounded-lg"
      style={{ backgroundColor: bgColor }}
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
