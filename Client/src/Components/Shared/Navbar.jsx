import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="my-2 text-white p-2">
      <div className="flex justify-around items-center">
        <div className="flex gap-2 items-center">
          <img
            src="../../../public/favicon.svg"
            alt="Logo"
            width="40"
            height="20"
          />
          <p className="font-semibold">QuickChat</p>
        </div>
        <nav>
          <ul className="flex gap-8 p-2 cursor-pointer font-medium">
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/")}>Chats</li>
            <li onClick={() => navigate("/Profile")}>Profile</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
