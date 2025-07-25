"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/redux/auth/authSlice";

export default function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/me`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        dispatch(loginSuccess(data.user));
      } catch (err) {
        console.log("Auto auth error:", err);
      }
    };

    fetchUser();
  });

  return null;
}
