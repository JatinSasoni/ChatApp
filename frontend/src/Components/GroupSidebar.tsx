import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { api } from "../../Api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";

const GroupSidebar = (props: Props) => {
  const [filter, setFilter] = useState<string>("");
  const [groupSelected, setGroupSelected] = useState(false);
  const [group, setGroup] = useState([]);
  const { loggedInUser } = useSelector((state: RootState) => state.auth);

  const filterGroup = group.filter((group) => {
    return group.name.toLowerCase().includes(filter.toLowerCase());
  });
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await api.get("/api/v1/groups/my", {
          withCredentials: true,
        });
        console.log(response);
        if (response.data.success) {
          setGroup(response.data.allGroups);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    if (loggedInUser) {
      fetchAllGroups();
    }
  }, [loggedInUser]);

  return (
    <div
      className={`mx-2 ${
        groupSelected && "max-[880px]:hidden"
      } p-2 min-w-52 min-[1400px]:min-w-70 overflow-y-scroll max-sm:h-[calc(100vh-56px)] sm:h-screen drop-shadow-md shadow-md duration-300`}
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
      {/*Users */}
      <aside>
        {!filterGroup ? (
          <div className="animate-pulse text-center text-gray-500">
            Loading Connections...
          </div>
        ) : (
          <>
            {/* Groups */}
            <p className="text-zinc-600 ">Groups - {group?.length}</p>
            <ul className="flex flex-col gap-3 ">
              {filterGroup.map((group) => {
                return (
                  <li className="cursor-pointer group" key={group._id}>
                    <div className="flex p-1 gap-2">
                      <div className="min-w-10">
                        {/* <img
                          src={user?.Profile.profilePhoto || "/avatar_icon.png"}
                          alt="Profile-Photo"
                          className="size-10 rounded-full object-cover"
                        /> */}
                      </div>
                      <div className=" flex justify-between pr-3 w-full items-center">
                        <div>
                          <p className="group group-hover:scale-105 duration-300">
                            {group.name}
                          </p>
                          <p className={`text-xs `}></p>
                        </div>
                        {/* <div
                          className={`bg-purple-300 rounded-full size-5 grid place-items-center ${
                            !unseenMessages[user._id] && "hidden"
                          }`}
                        >
                          <span className="text-sm">
                            {unseenMessages[user._id] &&
                              unseenMessages[user._id]}
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
};

export default GroupSidebar;
