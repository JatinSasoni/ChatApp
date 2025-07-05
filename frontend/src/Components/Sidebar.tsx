import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { CiSearch } from "react-icons/ci";
import {
  setUnseenMessages,
  setUserSelected,
} from "../../Store/Slices/message-slice";
import { useFetchUsers } from "../Hooks/fetchUsers";
import { useState } from "react";
import type { user } from "../../types/models";

const Sidebar: React.FC = () => {
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState<string>("");
  const { allUsers, unseenMessages, userSelected } = useSelector(
    (state: RootState) => state.message
  );
  const dispatch = useDispatch();

  //* custom hook to fetch allUsers and Unseen messages
  useFetchUsers();

  //*filter

  const filteredUsers = allUsers?.filter((user: user) => {
    return user.username.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div
      className={`${
        userSelected && "max-sm:hidden"
      } p-2 min-w-70 overflow-y-scroll max-sm:h-[calc(100vh-56px)] sm:h-screen drop-shadow-md shadow-md duration-300`}
    >
      {/* Header */}

      <h2 className="text-2xl">Messages</h2>
      {/* Search Contact */}
      <div className="flex gap-2 bg-slate-100  rounded-xl items-center px-2 my-3 py-1 ">
        <CiSearch />
        <input
          type="text"
          className="w-full outline-none"
          placeholder="Search User..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {/*Friends */}
      <aside>
        <ul className="flex flex-col gap-3 ">
          {filteredUsers?.map((user, key: number) => {
            return (
              <li
                key={key}
                className="cursor-pointer group"
                onClick={() => {
                  dispatch(setUserSelected(user));
                  dispatch(
                    setUnseenMessages({ ...unseenMessages, [user._id]: 0 })
                  );
                }}
              >
                <div className="flex p-1 gap-3">
                  <img
                    src={user?.Profile.profilePhoto || "/avatar_icon.png"}
                    alt=""
                    className="size-11 rounded-full"
                  />
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
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
