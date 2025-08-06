"use client";
import Image from "next/image";
import { Button } from "./Button";
import { InputField } from "./InputField";
import Logo from "@/app/assets/Logo.png";
import { usePathname } from "next/navigation";
//will populate these links later
const Footer = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  if (isDashboard) return null;
  return (
    <footer className="w-screen min-h-52 max-h-full mt-32 relative ">
      <div className="bg-[#0060AE] text-white rounded-r-full w-11/12 max-h-full min-h-52 absolute -top-20 z-10">
        <div className="flex flex-col w-11/12 m-auto my-10 ">
          <p className="font-bold tracking-wide text-3xl">
            Subscribe for Newsletter
          </p>
          <form className="flex justify-between w-11/12 gap-10">
            <InputField
              type="text"
              label=" "
              placeholder="Name"
              name="name"
              value=""
              onChange={() => {}}
            />
            <InputField
              type="email"
              label=" "
              placeholder="Email"
              name="email"
              value=""
              onChange={() => {}}
            />
            <Button
              type="submit"
              btnText="Subscribe"
              onClickFunction={() => {}}
              primary={true}
              className=""
            />
          </form>
        </div>
      </div>
      <div className="footer-gradient w-full h-full pt-40 p-10 flex items-start justify-around text-white">
        <div className="w-full p-5 rounded-lg h-full flex flex-col gap-5">
          <Image src={Logo} alt="Logo" width={100} height={100} />
          <p className="text-pretty">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae
            accusantium consectetur sequi quos. Iure veritatis eligendi unde sit
            ad dolorem, deleniti accusamus, id vel facilis dolorum nam tempora
            rerum mollitia.
          </p>
          <p className="text-pretty">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae
            accusantium consectetur sequi quos. Iure veritatis eligendi unde sit
            ad dolorem, deleniti accusamus, id vel facilis dolorum nam tempora
            rerum mollitia.
          </p>
        </div>
        <div className="w-full p-5 rounded-lg h-full">
          <h3>Donate Now</h3>
          <p>Meezan Bank: 023091823897129</p>
          <p>Meezan Bank: 023091823897129</p>
          <h3>Donate In-Person</h3>
          <p>Meezan Bank: 023091823897129</p>
          <h3>Address</h3>
          <p>Alkhidmat address Lahore</p>
          <h3>Connect with Us</h3>
          <p>Alkhidmat address Lahore</p>
          <p>Alkhidmat address Lahore</p>
          <p>Alkhidmat address Lahore</p>
          <p>Alkhidmat address Lahore</p>
        </div>
        <div className="w-10/12 p-5 rounded-lg h-full bg-yellow-400">
          <h2>EMERGENCY APPEAL</h2>
          <p>GAZA Relief</p>
          <p>GAZA Relief</p>
          <p>GAZA Relief</p>
          <h3>Connect with Us</h3>
          <p>Alkhidmat address Lahore</p>
          <p>Alkhidmat address Lahore</p>
          <p>Alkhidmat address Lahore</p>
          <p>Alkhidmat address Lahore</p>
        </div>
      </div>
      <div className="bg-[#003C73] w-full h-60 flex md:flex-col ">
        <div className="w-3/4 m-auto h-full ">
          <p>© Copyright 1990-2025 Alkhidmat Foundation Pakistan</p>
          <ul className="flex items-end ">
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
