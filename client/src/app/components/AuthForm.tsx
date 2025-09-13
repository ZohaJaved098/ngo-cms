"use client";
import React, { useState } from "react";
import Link from "next/link";

import { InputField } from "@/app/components/InputField";
import { RadioInput } from "@/app/components/RadioInput";
import { Button } from "@/app/components/Button";

import { useDispatch } from "react-redux";
import { loginSuccess, registerSuccess } from "@/app/redux/auth/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  profilePic?: string;
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
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const authUrl = login
      ? `${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`
      : `${process.env.NEXT_PUBLIC_AUTH_API_URL}/register`;

    let options: RequestInit;

    if (login) {
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
        credentials: "include",
      };
    } else {
      const fd = new FormData();
      fd.append("username", inputs.username);
      fd.append("email", inputs.email);
      fd.append("password", inputs.password);
      fd.append("confirmPassword", inputs.confirmPassword);
      fd.append("role", inputs.role);
      if (profilePic) fd.append("profilePic", profilePic);

      options = {
        method: "POST",
        body: fd,
        credentials: "include",
      };
    }

    const res = await fetch(authUrl, options);
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
    setProfilePic(null);

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
          <>
            <div className="h-32 w-32 mx-auto mt-5  rounded-full shadow-lg ">
              <Image
                src={
                  previewUrl
                    ? previewUrl
                    : profilePic && typeof profilePic === "string"
                    ? profilePic
                    : `https://api.dicebear.com/6.x/avataaars/png?seed=${
                        inputs.username || "default"
                      }`
                }
                alt="profile pic"
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-300"
                width={100}
                height={100}
              />
            </div>
            <InputField
              label="Profile Pic"
              name="profilePic"
              type="file"
              accept="image/*"
              onChange={onProfilePicChange}
              error={errors.profilePic}
            />
          </>
        )}
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
