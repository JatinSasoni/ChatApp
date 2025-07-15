import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { CiSearch } from "react-icons/ci";
import { useFetchUsers } from "../Hooks/fetchUsers";
import { useState } from "react";
import type { user } from "../../types/models";
import SidebarUserCard from "./SidebarUserCard";

const Sidebar: React.FC = () => {
  const [filter, setFilter] = useState<string>("");
  const { allUsers, userSelected } = useSelector(
    (state: RootState) => state.message
  );
  const { friends } = useSelector((state: RootState) => state.friendship);

  //* custom hook to fetch allUsers and Unseen messages
  useFetchUsers();

  const nonFriendUsers = allUsers?.filter((user: user) => {
    return !friends?.some((friend) => friend._id === user._id);
  });

  //*filter
  const filteredUsers = nonFriendUsers?.filter((user: user) => {
    return user.username.toLowerCase().includes(filter.toLowerCase());
  });
  const filterFriends = friends?.filter((user: user) => {
    return user.username.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div
      className={`mx-2 ${
        userSelected && "max-[880px]:hidden"
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
        {!filteredUsers ? (
          <div className="animate-pulse text-center text-gray-500">
            Loading Connections...
          </div>
        ) : (
          <>
            {/* friends */}
            <p className="text-zinc-600">Friends - {filterFriends?.length}</p>

            <ul className="flex flex-col gap-3 ">
              {filterFriends?.map((user) => {
                return <SidebarUserCard key={user._id} user={user} />;
              })}
            </ul>

            {/* All-users */}
            <p className="text-zinc-600 ">Users - {filteredUsers?.length}</p>
            <ul className="flex flex-col gap-3 ">
              {filteredUsers?.map((user) => {
                return <SidebarUserCard key={user._id} user={user} />;
              })}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
