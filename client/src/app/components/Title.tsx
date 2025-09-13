import React from "react";
type TitleProps = {
  text: string;
  className?: string;
};
const Title: React.FC<TitleProps> = ({ text, className }) => {
  return (
    <h1
      className={`text-4xl font-bold capitalize text-gray-600 my-5 ${className}`}
    >
      {text}
    </h1>
  );
};

export default Title;
