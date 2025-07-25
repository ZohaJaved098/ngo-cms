import React from "react";
type ButtonProps = {
  btnText: string;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  cancel?: boolean;
  type: "button" | "submit" | "reset";
  onClickFunction: () => void;
  className?: string;
  loading?: boolean;
};
export const Button: React.FC<ButtonProps> = ({
  btnText,
  primary,
  secondary,
  tertiary,
  cancel,
  type,
  onClickFunction,
  className,
  loading,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        ${primary && "bg-red-700 font-black text-white "}
        ${secondary && "bg-blue-700 text-white "}
        ${tertiary && "bg-green-700 text-white "}
        ${cancel && "bg-gray-500 text-white"}
        
        ${className}
         focus:outline-0 p-2 rounded-lg text-center w-full
      `}
      onClick={onClickFunction}
    >
      <p className={``}>{btnText}</p>
    </button>
  );
};
