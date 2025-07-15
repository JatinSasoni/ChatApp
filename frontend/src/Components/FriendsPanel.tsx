import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import FriendAndRequestCard from "./FriendAndRequestCard";
import { useState } from "react";
import type { user } from "../../types/models";

const FriendsPanel = () => {
  const { friends } = useSelector((state: RootState) => state.friendship);
  const [filter, setFilter] = useState<string>("");

  const filteredFriends = friends.filter((friend: user) => {
    return friend.username.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="lg:col-span-2 mt-6 sm:mt-8 lg:mt-0 ">
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <div className="flex gap-3 items-center py-2">
          <h2 className=" sm:text-2xl font-bold ">
            Friends ({filteredFriends.length})
          </h2>
          <input
            type="text"
            className="bg-slate-100 rounded p-1 border border-slate-200 w-1/2 outline-none"
            placeholder="Search a friend..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {filteredFriends.length > 0 ? (
          <ul className="flex flex-col gap-4 overflow-y-auto overflow-scroll pr-1 max-h-75">
            {filteredFriends.map((friend) => (
              <FriendAndRequestCard
                key={friend._id}
                user={friend}
                actionType="unfriend"
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
            <img src="/addfriend.svg" alt="No Friends" className="h-40 mb-4" />
            <p className="text-lg font-medium">
              No connections — start making friends!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You don't have such or any friends
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPanel;
