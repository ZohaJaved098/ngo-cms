import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
// import { MdOutlineEmail } from "react-icons/md";
type InputFieldProps = {
  label?: string;
  type?: string;
  name: string;
  value: string;
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
  return (
    <div
      className={`flex flex-col justify-start items-start my-1 w-full relative rounded-lg  `}
    >
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex items-center gap-3 w-full">
        <input
          className={`p-3 rounded-lg w-full outline-0 bg-white `}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          accept={accept}
        />
        {type === "password" && (
          <div className="absolute right-5 top-11 cursor-pointer">
            {showPassword ? (
              <FaRegEyeSlash
                // className=" dark:text-neutral-100"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaRegEye
                // className="dark:text-neutral-300"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 animate-bounce ">{error}</p>}
    </div>
  );
};
