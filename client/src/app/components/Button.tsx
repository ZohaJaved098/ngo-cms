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
  disabled?: boolean;
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
  // loading,
  disabled,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${primary && "bg-red-700 font-black  "}
        ${secondary && "bg-blue-700  "}
        ${tertiary && "bg-green-700  "}
        ${cancel && "bg-gray-500 "}
        
        ${className}
         focus:outline-0 px-4 py-2 rounded-lg text-center tracking-wide w-full
         cursor-pointer
      `}
      onClick={onClickFunction}
    >
      <p className={`text-white text-base`}>{btnText}</p>
    </button>
  );
};
