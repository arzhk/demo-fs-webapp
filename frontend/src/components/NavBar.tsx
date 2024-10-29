import React from "react";
import { FaBell, FaHouse, FaUser } from "react-icons/fa6";
import P from "./typography/P";
import Link from "next/link";

function NavBar() {
  return (
    <div className="w-full px-10 py-5 bg-primary flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <FaHouse />
        </Link>
        {["Questionnaires", "CAIQ", "Manage"].map((item) => (
          <React.Fragment key={item}>
            <P>/</P>
            <P>{item}</P>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-10">
        <p className="bg-blue-200 text-blue-900 font-bold tracking-tighter px-2 rounded-[5px]">SANDBOX</p>
        <FaBell className="text-xl" />
        <FaUser className="text-xl" />
      </div>
    </div>
  );
}

export default NavBar;
