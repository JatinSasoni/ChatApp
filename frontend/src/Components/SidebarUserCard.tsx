import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUnseenMessages,
  setUserSelected,
} from "../../Store/Slices/message-slice";
import type { user } from "../../types/models";
import type { RootState } from "../../Store/store";

type Props = {
  user: user;
};

const SidebarUserCard: React.FC<Props> = ({ user }) => {
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { unseenMessages } = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch();
  return (
    <li
      className="cursor-pointer group"
      onClick={() => {
        dispatch(setUserSelected(user));
        dispatch(setUnseenMessages({ ...unseenMessages, [user._id]: 0 }));
      }}
    >
      <div className="flex p-1 gap-2">
        <div className="min-w-10">
          <img
            src={user?.Profile.profilePhoto || "/avatar_icon.png"}
            alt="Profile-Photo"
            className="size-10 rounded-full object-cover"
          />
        </div>
        <div className=" flex justify-between pr-3 w-full items-center">
          <div>
            <p className="group group-hover:scale-105 duration-300">
              {user.username}
            </p>
            <p
              className={`text-xs ${
                onlineUsers.includes(user._id) ? "text-green-500" : ""
              }`}
            >
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </p>
          </div>
          <div
            className={`bg-purple-300 rounded-full size-5 grid place-items-center ${
              !unseenMessages[user._id] && "hidden"
            }`}
          >
            <span className="text-sm">
              {unseenMessages[user._id] && unseenMessages[user._id]}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SidebarUserCard;
