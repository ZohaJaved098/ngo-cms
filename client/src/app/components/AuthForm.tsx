"use client";
import React, { useState } from "react";
import Link from "next/link";

import { InputField } from "@/app/components/InputField";
import { RadioInput } from "@/app/components/RadioInput";
import { Button } from "@/app/components/Button";

import { useDispatch } from "react-redux";
import { loginSuccess, registerSuccess } from "@/app/redux/auth/authSlice";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  login: boolean;
};
type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  existingUser?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ login }) => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const authUrl = login
      ? `${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`
      : `${process.env.NEXT_PUBLIC_AUTH_API_URL}/register`;

    const res = await fetch(authUrl, {
      method: "POST",
      body: JSON.stringify(inputs),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || {});
      setLoading(false);
      return;
    }

    setErrors({});
    setInputs({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    });

    if (login) {
      dispatch(loginSuccess({ ...data.user, token: data.token }));

      if (data.user.role === "admin" || data.user.role === "manager") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } else {
      dispatch(registerSuccess());
      router.push("/auth/login");
    }

    setLoading(false);
  };

  return (
    <>
      <form
        method="post"
        id={login ? "login" : "register"}
        name={login ? "login" : "register"}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full h-full"
      >
        {!login && (
          <InputField
            type={"text"}
            label={"Name"}
            name={"username"}
            value={inputs.username}
            onChange={handleChange}
            autoComplete={"on"}
            error={errors.username}
          />
        )}
        <InputField
          label={"Email"}
          name={"email"}
          type={"email"}
          value={inputs.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="off"
        />
        {login ? (
          <>
            <InputField
              label="Password"
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              error={errors.password}
            />
            {/* <div className="flex justify-end text-sm">
              <Link href="/" className="text-blue-400 underline">
                Forgot Password?
              </Link>
            </div> */}
          </>
        ) : (
          <>
            <InputField
              label="Set New Password"
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              error={errors.password}
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
        {!login && (
          <div>
            <RadioInput
              name="role"
              value={inputs.role}
              onChange={handleChange}
              error={errors.role}
              options={["admin", "manager", "user"]}
            />
          </div>
        )}
        {errors.existingUser && (
          <p className="text-red-500  ">{errors.existingUser}</p>
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
