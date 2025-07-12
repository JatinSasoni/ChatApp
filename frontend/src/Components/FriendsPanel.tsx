import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import FriendAndRequestCard from "./FriendAndRequestCard";

const FriendsPanel = () => {
  const { friends } = useSelector((state: RootState) => state.friendship);
  return (
    <div className="lg:col-span-2 mt-8 lg:mt-0 ">
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <h2 className="text-2xl font-bold mb-4">Friends ({friends.length})</h2>

        {friends.length > 0 ? (
          <ul className="flex flex-col gap-4 overflow-y-auto overflow-scroll pr-1 max-h-75">
            {friends.map((friend) => (
              <FriendAndRequestCard
                key={friend._id}
                user={friend}
                actionType="unfriend"
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-center text-gray-600">
            <img src="/addfriend.svg" alt="No Friends" className="h-40 mb-4" />
            <p className="text-lg font-medium">
              No connections yet — start making friends!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Search users and send them a friend request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPanel;
