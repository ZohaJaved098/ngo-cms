"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import { loginSuccess } from "@/app/redux/auth/authSlice";
import { useState } from "react";
import Image from "next/image";
import { InputField } from "@/app/components/InputField";
import { Button } from "@/app/components/Button";
import Title from "@/app/components/Title";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState(user.username);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.profilePic || "");

  const onProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSave = async () => {
    const fd = new FormData();
    fd.append("username", username);
    if (profilePic) fd.append("profilePic", profilePic);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_USER_API_URL}/${user._id}`,
      {
        method: "PUT",
        body: fd,
        credentials: "include",
      }
    );

    const data = await res.json();
    if (res.ok) {
      dispatch(loginSuccess({ ...data.user, token: user.token }));
    }
    router.push("/");
  };

  return (
    <div className="max-w-lg mx-auto my-10 flex flex-col gap-5">
      <Title text="My Profile" />

      <div className="h-32 w-32 mx-auto rounded-full overflow-hidden shadow">
        <Image
          src={
            previewUrl ||
            `https://api.dicebear.com/6.x/avataaars/png?seed=${username}`
          }
          alt="profile"
          width={128}
          height={128}
          className="object-cover border-2 border-gray-700 rounded-full"
        />
      </div>
      <hr className="text-gray-500" />

      <InputField
        label="Profile Picture"
        name="profilePic"
        type="file"
        accept="image/*"
        onChange={onProfilePicChange}
      />
      <InputField
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
      />

      <div className=" flex flex-wrap justify-between items-center">
        <div className="flex gap-5 items-center">
          <h3 className="text-lg font-medium">Email:</h3>
          <p className="text-lg font-normal"> {user.email}</p>
        </div>
        <div className="flex gap-5 items-center">
          <h3 className="text-lg font-medium">Role:</h3>
          <p className="text-lg font-normal capitalize">{user.role}</p>
        </div>
      </div>
      <hr className="text-gray-500" />

      <div className="flex gap-5 self-end">
        <Button
          type="button"
          btnText="Save Changes"
          tertiary
          onClickFunction={onSave}
        />
        <Button
          type="button"
          btnText="Cancel"
          primary
          onClickFunction={() => router.push("/dashboard")}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
