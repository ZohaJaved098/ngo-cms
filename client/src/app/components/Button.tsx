import React from "react";
type ButtonProps = {
  btnText: string;
  primary?: boolean;
  secondary?: boolean;
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
        ${secondary && "bg-white border-blue-400 border-4 "}
        ${cancel && "bg-gray-500 text-white"}
        
        ${className}
         focus:outline-0 p-5 rounded-lg text-center w-full
      `}
      onClick={onClickFunction}
    >
      <p className={``}>{btnText}</p>
    </button>
  );
};
