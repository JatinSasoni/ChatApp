import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
// import assets from "../../chat-app-assets/as";

const RightSidebar: React.FC = () => {
  const { userSelected } = useSelector((state: RootState) => state.message);
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
            src="../../chat-app-assets/profile_alison.png"
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
