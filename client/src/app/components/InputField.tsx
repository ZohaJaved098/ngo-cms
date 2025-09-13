"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

type InputFieldProps = {
  label: string;
  type: string;
  name: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;

  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  autoComplete,
  required = true,
  placeholder,
  disabled,
  accept,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div
      className={`flex flex-col justify-start gap-3 items-start my-1 w-full  rounded-lg  `}
    >
      {label && (
        <label className=" font-medium capitalize" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex items-center gap-3 w-full relative ">
        <input
          className={`p-4 rounded-lg w-full outline-0 text-black ${
            isDashboard ? "bg-gray-300" : "bg-white border border-gray-500 "
          }
           ${type === "number" ? "max-w-1/2" : "w-full"} `}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          accept={accept}
          multiple={name === "images"}
        />
        {type === "password" && (
          <div className="absolute right-5 top-2.5 cursor-pointer text-black">
            {showPassword ? (
              <FaRegEyeSlash
                className="w-5 h-5"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaRegEye
                className="w-5 h-5"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500  ">{error}</p>}
    </div>
  );
};
