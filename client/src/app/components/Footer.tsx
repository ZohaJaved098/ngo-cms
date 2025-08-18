"use client";
import Image from "next/image";
import { Button } from "./Button";
import { InputField } from "./InputField";
import Logo from "@/app/assets/Logo.png";
import { usePathname } from "next/navigation";
import { TiArrowRightThick } from "react-icons/ti";

const Footer = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <footer className="w-screen mt-32 relative bg-[#004080]">
      {/* Newsletter */}
      <div className="bg-[#0060AE] text-white sm:rounded-r-full w-full sm:w-11/12 py-10 sm:absolute sm:-top-20 sm:z-10">
        <div className="flex flex-col items-center sm:items-start w-11/12 mx-auto">
          <p className="font-bold tracking-wide text-3xl mb-5">
            Subscribe for Newsletter
          </p>
          <form className="flex sm:flex-row flex-col justify-between w-full gap-3 sm:gap-5">
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
              primary
            />
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-gradient w-full sm:pt-40 p-10 flex flex-wrap md:flex-nowrap items-start justify-around text-white gap-6">
        {/* About */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-5">
          <Image src={Logo} alt="Logo" width={100} height={100} />
          <p className="text-center md:text-left">
            Alkhidmat Foundation is one of the leading non-profit organizations
            providing humanitarian services across Pakistan in areas like
            health, education, orphan care, and community development.
          </p>
        </div>

        {/* Donate & Contact */}
        <div className="w-full md:w-1/3">
          <h3 className="font-bold mb-3">Donate Now</h3>
          <p>Meezan Bank: 023091823897129</p>
          <p>Bank Alfalah: 987654321098</p>

          <h3 className="font-bold mt-4 mb-2">Donate In-Person</h3>
          <p>Visit our offices nationwide</p>

          <h3 className="font-bold mt-4 mb-2">Address</h3>
          <p>Alkhidmat Foundation, Lahore, Pakistan</p>

          <h3 className="font-bold mt-4 mb-2">Connect with Us</h3>
          <p>Email: info@alkhidmat.org</p>
          <p>Phone: +92 42 1234567</p>
        </div>

        {/* Emergency Appeal */}
        <div className="w-3/4 md:w-1/3 bg-[#f59323] text-white p-6 rounded-t-lg flex flex-col justify-between relative z-10 min-h-[350px] md:min-h-screen -mb-10 shadow-inner shadow-black/20">
          <div className="flex-1 flex flex-col justify-between">
            <h2 className="text-3xl font-bold mb-3 capitalize ">
              Emergency appeals
            </h2>
            <ul className="space-y-2 text-[#001B40] flex-1">
              <li className="cursor-pointer flex items-center gap-2">
                <TiArrowRightThick className="w-5 h-5 font-bold" />
                <p>GAZA Relief</p>
              </li>
              <li className="cursor-pointer flex items-center gap-2">
                <TiArrowRightThick className="w-5 h-5 font-bold" />
                <p>Flood Relief</p>
              </li>
              <li className="cursor-pointer flex items-center gap-2">
                <TiArrowRightThick className="w-5 h-5 font-bold" />
                <p>Winter Appeal</p>
              </li>
              <li className="cursor-pointer flex items-center gap-2">
                <TiArrowRightThick className="w-5 h-5 font-bold" />
                <p>Orphan Care</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#003C73] w-full py-5 flex flex-col md:flex-row justify-between items-center px-6 ">
        <p className="text-lg text-gray-200">
          © Copyright 1990-2025 Alkhidmat Foundation Pakistan
        </p>
        <ul className="flex gap-5 text-lg text-gray-200 mt-3 md:mt-0">
          <li className="cursor-pointer hover:text-[#f59323] text-lg flex items-center gap-2">
            Home
          </li>
          <li className="cursor-pointer hover:text-[#f59323] text-lg flex items-center gap-2">
            About
          </li>
          <li className="cursor-pointer hover:text-[#f59323] text-lg flex items-center gap-2">
            Media
          </li>
          <li className="cursor-pointer hover:text-[#f59323] text-lg flex items-center gap-2">
            Events
          </li>
          <li className="cursor-pointer hover:text-[#f59323] text-lg flex items-center gap-2">
            Donate
          </li>
          <li className="cursor-pointer hover:text-[#f59323] text-lg flex items-center gap-2">
            Contact
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
