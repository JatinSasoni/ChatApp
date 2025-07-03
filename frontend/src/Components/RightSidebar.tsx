import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { imagesDummyData } from "../../chat-app-assets/assets";

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
            src={userSelected?.Profile.profilePhoto || "/avatar_icon.png"}
            alt="Profile_Pic"
            className="size-40 rounded-full mx-auto"
          />
          <p className="text-2xl text-center">
            {userSelected?.username || "User"}
          </p>
          <p className="text-sm text-center">
            {userSelected?.email || "unknown"}
          </p>
        </div>
        {/* Media */}
        <p className="font-medium">Media</p>
        <div className="p-2 border h-80 overflow-scroll">
          <div className="grid grid-cols-2 gap-3">
            {imagesDummyData?.map((image: string, index: number) => {
              return (
                <img
                  key={index}
                  src={image}
                  alt="media"
                  className="hover:scale-105 duration-100"
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
