// components/RightSidebarContent.tsx
import React, { useEffect, useState } from "react";
import type { user } from "../../types/models";
import { IoPersonAddSharp } from "react-icons/io5";
import { api } from "../../Api/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";

type Props = {
  userSelected: user | null;
  msgImages: string[] | null | undefined;
};

const RightSidebarContent: React.FC<Props> = ({ userSelected, msgImages }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alreadyFriend, setAlreadyFriend] = useState<boolean | undefined>(
    false
  );
  const { friends } = useSelector((state: RootState) => state.message);

  //sendRequestHandler
  const sendRequestHandler = async (receiverId: string | undefined) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/api/v1/friendship/send/${receiverId}/request`,
        "",
        {
          withCredentials: true,
        }
      );
      if (response?.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isFriend = friends?.some(
      (friend) => friend._id === userSelected?._id
    );

    setAlreadyFriend(isFriend);
  }, [userSelected, friends]);

  return (
    <div className="h-full">
      <div className="flex justify-between px-2 ">
        <p className="text-xl">Profile</p>
        {alreadyFriend ? (
          ""
        ) : loading ? (
          <div className="border-t-2 border-b-2 rounded-full p-3 animate-spin"></div>
        ) : (
          <button
            onClick={() => sendRequestHandler(userSelected?._id)}
            aria-label="Send Friend Request"
          >
            <IoPersonAddSharp className="my-auto hover:scale-110 duration-200 size-5" />
          </button>
        )}
      </div>
      {/* PFP */}
      <div className="my-2 ">
        <img
          src={userSelected?.Profile?.profilePhoto || "/avatar_icon.png"}
          alt="Profile_Pic"
          className="size-40 rounded-full mx-auto cursor-pointer object-cover "
          onClick={() =>
            userSelected?.Profile?.profilePhoto &&
            window.open(userSelected?.Profile?.profilePhoto)
          }
        />
        <p className="text-2xl mt-2 text-center">
          {userSelected?.username || "User"}
        </p>
        <p className="text-sm text-center overflow-x-scroll">
          {userSelected?.Profile.bio}
        </p>

        <p className="text-sm text-center">
          {userSelected?.email || "unknown"}
        </p>
      </div>
      {/* Media */}
      <p className="font-medium">Media</p>
      <div className="p-2 rounded-md h-90 overflow-scroll shadow bg-slate-50 border border-slate-400">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 gap-y-4 p-2 ">
          {msgImages && msgImages.length > 0 ? (
            msgImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="media"
                className="hover:scale-105 duration-200 object-cover  min-[1400]:size-32 2xl:size-40 shadow-xl"
                onClick={() => window.open(image)}
              />
            ))
          ) : (
            <span>No media</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebarContent;
