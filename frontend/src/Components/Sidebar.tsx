import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useEffect } from "react";
import { api } from "../../Api/axios";
import {
  setAllUsers,
  setUnseenMessages,
  setUserSelected,
} from "../../Store/Slices/message-slice";
import axios from "axios";

const Sidebar: React.FC = () => {
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { allUsers, unseenMessages } = useSelector(
    (state: RootState) => state.message
  );
  const dispatch = useDispatch();

  const fetchAllUsers = async () => {
    try {
      const response = await api.get("/api/v1/user/get-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setAllUsers(response?.data?.users || null));
        dispatch(setUnseenMessages(response.data.unseenMessages));
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className=" p-2 overflow-scroll h-full">
      {/* Header */}
      <div className="flex justify-between">
        <p className="text-2xl text-white">Public Chats</p>
        <div className="relative group">
          <img
            src="../assets/menu_icon.png"
            alt=""
            width="30"
            className="cursor-pointer"
          />
          <div className="absolute group hidden group-hover:block border-white border right-5 p-2 w-30 backdrop-blur-md">
            <button className="text-white px-2 hover:scale-105 ">
              Edit Profile
            </button>
            <hr className="text-white" />
            <button className="text-white px-2 hover:scale-105">Logout</button>
          </div>
        </div>
      </div>
      {/* Search Contact */}
      <div className="flex gap-2 bg-blue-950 rounded-xl items-center px-2 my-3 py-1 ">
        <img src="../assets/search_icon.png" alt="" className="size-3" />
        <input
          type="text"
          className="w-full outline-none text-white"
          placeholder="Search User..."
        />
      </div>
      {/*Friends */}
      <aside>
        <ul className="flex flex-col gap-3">
          {allUsers?.map((user, key: number) => {
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
                    src={
                      user?.Profile.profilePhoto ||
                      "../../chat-app-assets/profile_alison.png"
                    }
                    alt=""
                    className="size-11 rounded-full"
                  />
                  <div className="text-white flex justify-between pr-3 w-full items-center">
                    <div>
                      <p className="group group-hover:scale-105 duration-300">
                        {user.username}
                      </p>
                      <p
                        className={`text-xs ${
                          onlineUsers.includes(user._id) ? "text-green-400" : ""
                        }`}
                      >
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                      </p>
                    </div>
                    <div
                      className={`bg-green-600 rounded-full size-5 grid place-items-center ${
                        !unseenMessages[user._id] && "hidden"
                      }`}
                    >
                      <span className="text-sm ">
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
