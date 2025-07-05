import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";

const RightSidebar: React.FC = () => {
  const { userSelected, selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );
  const [msgImages, setMsgImages] = useState<string[] | undefined>([]);
  console.log(userSelected);
  console.log(msgImages);

  useEffect(() => {
    setMsgImages(() =>
      selectedUserMessages?.filter((msg) => msg.image).map((msg) => msg.image)
    );
  }, [userSelected, selectedUserMessages]);
  return (
    <section
      className={`w-full max-sm:hidden ml-2 ${
        userSelected ? "block" : "hidden"
      }  p-2 rounded-xl shadow`}
    >
      {/* container */}
      <div className="h-full">
        <p className="text-xl">Profile</p>
        {/* PFP */}
        <div className="my-2">
          <img
            src={userSelected?.Profile.profilePhoto || "/avatar_icon.png"}
            alt="Profile_Pic"
            className="size-40 rounded-full mx-auto cursor-pointer"
            onClick={() =>
              userSelected?.Profile.profilePhoto &&
              window.open(userSelected?.Profile?.profilePhoto)
            }
          />
          <p className="text-2xl mt-2 text-center">
            {userSelected?.username || "User"}
          </p>
          <p className="text-sm text-center">
            {userSelected?.email || "unknown"}
          </p>
        </div>
        {/* Media */}
        <p className="font-medium">Media</p>
        <div className="p-2 rounded-md h-96 overflow-scroll shadow">
          <div className="grid grid-cols-2 gap-3">
            {msgImages && msgImages?.length > 0 ? (
              msgImages?.map((image: string, index: number) => {
                return (
                  <img
                    key={index}
                    src={image}
                    alt="media"
                    className="hover:scale-105 duration-100"
                    onClick={() => window.open(image)}
                  />
                );
              })
            ) : (
              <span>No media </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
