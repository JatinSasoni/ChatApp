import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { IoPersonAddSharp } from "react-icons/io5";
import useSendFriendRequest from "../Hooks/useSendFriendRequest";

type Props = {
  member: {
    _id: string;
    username: string;
    Profile: {
      profilePhoto: string;
      bio: string;
    };
  };
};

const GroupMembersCard: React.FC<Props> = ({ member }) => {
  const { onlineUsers, loggedInUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [alreadyFriend, setAlreadyFriend] = useState<boolean | undefined>(
    false
  );
  const { friends } = useSelector((state: RootState) => state.friendship);

  const { loading, sendRequestHandler } = useSendFriendRequest();

  useEffect(() => {
    const isFriend = friends?.some((friend) => friend._id === member?._id);

    setAlreadyFriend(isFriend);
  }, [member, friends]);

  return (
    <li className="cursor-pointer group">
      <div className="flex p-1 gap-2">
        <div className="min-w-10">
          <img
            src={member?.Profile.profilePhoto || "/avatar_icon.png"}
            alt="Profile-Photo"
            className="size-10 rounded-full object-cover"
          />
        </div>
        <div className=" flex justify-between pr-3 w-full items-center">
          <div>
            <p className="group group-hover:scale-105 duration-300">
              {member.username}
              {member._id === loggedInUser?._id && " (You)"}
            </p>
            <p
              className={`text-xs ${
                onlineUsers.includes(member._id) ? "text-green-500" : ""
              }`}
            >
              {onlineUsers.includes(member._id) ? "Online" : "Offline"}
            </p>
          </div>
          <div>
            {alreadyFriend || member._id === loggedInUser?._id ? (
              ""
            ) : loading ? (
              <div className="border-t-2 border-b-2 rounded-full p-3 animate-spin"></div>
            ) : (
              <button
                onClick={() => sendRequestHandler(member?._id)}
                aria-label="Send Friend Request"
              >
                <IoPersonAddSharp className="my-auto hover:scale-110 duration-200 size-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default GroupMembersCard;
