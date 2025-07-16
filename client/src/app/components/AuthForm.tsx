"use client";
import React, { useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { validateForm } from "@/app/utils/formValidate";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";

type AuthFormProps = {
  login: boolean;
};
type FormErrors = {
  userName?: string;
  userEmail?: string;
  userPassword?: string;
  confirmPassword?: string;
  role?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ login }) => {
  const [inputs, setInputs] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const [loading, setLoading] = useState(false);
  //   const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.value);
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    console.log("Updated inputs:", inputs);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Validate the form inputs
    const validationErrors = validateForm(inputs, login);
    console.log("validationErrors", validationErrors);
    setErrors(validationErrors);

    // If there are validation errors, do not proceed with the form submission
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // If there are no validation errors, proceed with the form submission
    // handleEmailAuth({
    //   auth,
    //   inputs,
    //   login,
    //   navigate,
    //   setErrors,
    // });

    console.log("Form submitted");
    setLoading(false);
  };

  return (
    <>
      <form
        method="post"
        id={login ? "login" : "register"}
        name={login ? "login" : "register"}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full h-full sm:h-screen md:w-1/2"
      >
        {!login && (
          <InputField
            type={"text"}
            label={"Name"}
            name={"userName"}
            value={inputs.userName}
            onChange={handleChange}
            autoComplete={"on"}
            error={errors.userName}
          />
        )}
        <InputField
          label={"Email"}
          name={"userEmail"}
          type={"email"}
          value={inputs.userEmail}
          onChange={handleChange}
          error={errors.userEmail}
          autoComplete="off"
        />
        {login ? (
          <>
            <InputField
              label="Password"
              type="password"
              name="userPassword"
              value={inputs.userPassword}
              onChange={handleChange}
              error={errors.userPassword}
            />
            <div className="flex justify-end text-sm">
              <Link href="/" className="text-blue-400 underline">
                Forgot Password?
              </Link>
            </div>
          </>
        ) : (
          <>
            <InputField
              label="Set New Password"
              type="password"
              name="userPassword"
              value={inputs.userPassword}
              onChange={handleChange}
              error={errors.userPassword}
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </>
        )}
        <div className="flex flex-col gap-3 items-start">
          <div className="flex justify-center items-center w-full gap-5">
            <Button
              loading={loading}
              btnText={login ? "Login" : "Register"}
              primary={true}
              type="submit"
              onClickFunction={() => {}}
              secondary={false}
              cancel={false}
            />
          </div>
          {login ? (
            <div className="flex-col lg:flex-row items-start flex gap-2">
              <p>Don&apos;t have an account?</p>
              <Link href="register" className="text-blue-400 underline">
                Register Now!
              </Link>
            </div>
          ) : (
            <div className="flex-col lg:flex-row items-start flex gap-2">
              <p>Already have an account?</p>
              <Link href="login" className="text-blue-400 underline">
                Login Now!
              </Link>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default AuthForm;
