import React from "react";
import assets from "../../chat-app-assets/assets";

const RightSidebar = ({ setUserSelected, userSelected }) => {
  return (
    <section
      className={`${
        userSelected ? "block" : "hidden"
      } text-white border p-2 rounded-xl shadow-2xl bg-blue-950`}
    >
      {/* container */}
      <div className=" h-full">
        <p className="text-white text-xl">Profile</p>
        {/* PFP */}
        <div className="my-2">
          <img
            src={assets.profile_martin}
            alt="Profile_Pic"
            className="size-40 rounded-full mx-auto"
          />
          <p className="text-2xl text-center">Jatin Sasoni</p>
          <p className="text-sm text-center">jatin@gmail.com</p>
        </div>
        {/* Media */}
        <div className="p-2 border">
          <p>Media</p>
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
