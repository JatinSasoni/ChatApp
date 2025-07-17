import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../../Store/store";
import GroupMembersCard from "./GroupMembersCard"; // assuming this exists
import GroupAddMemberCard from "./GroupAddMemberCard";
import { api } from "../../Api/axios";
import toast from "react-hot-toast";
import { setGroupSelected } from "../../Store/Slices/Group-slice";
// import GroupAddMemberCard from "./GroupAddMemberCard"; // create this component as needed

const GroupRightSideBar = () => {
  const dispatch = useDispatch();
  const { groupSelected, selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );
  const { friends } = useSelector((state: RootState) => state.friendship);
  const [msgImages, setMsgImages] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "media" | "members" | "addMembers"
  >("media");

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriends(
      (prev) =>
        prev.includes(friendId)
          ? prev.filter((id) => id !== friendId) // Deselect
          : [...prev, friendId] // Select
    );
  };

  useEffect(() => {
    setMsgImages(
      selectedGroupMessages
        ?.filter((msg) => msg.image)
        .map((msg) => msg.image) || []
    );
  }, [selectedGroupMessages, groupSelected]);

  //ADD TO GROUP HANDLER
  const addToGroupHandler = async () => {
    console.log("ok");
    const response = await api.post(
      `/api/v1/groups/${groupSelected?._id}/add-members`,
      {
        members: selectedFriends,
      },
      {
        withCredentials: true,
      }
    );
    console.log(response);

    if (response.data.success) {
      toast.success("Added to group");
      setSelectedFriends([]);
    }
  };

  return (
    <section
      className={`${
        !groupSelected && "hidden"
      } h-screen px-2 border border-gray-500 rounded w-full`}
    >
      <div className="h-full">
        <div className="flex justify-between px-2">
          <p className="text-xl">Profile</p>
        </div>

        <div className="my-2">
          <img
            src={groupSelected?.profile?.profilePhoto || "/avatar_icon.png"}
            alt="Profile_Pic"
            className="size-40 rounded-full mx-auto cursor-pointer object-cover"
            onClick={() =>
              groupSelected?.profile?.profilePhoto &&
              window.open(groupSelected?.profile?.profilePhoto)
            }
          />
          <p className="text-2xl mt-2 text-center">
            {groupSelected?.name || "Group"}
          </p>
          <p className="text-sm text-center">
            {`Admin - ${groupSelected?.admin.username}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 my-1">
          <button
            className={`font-medium ${
              selectedTab === "media" && "bg-slate-100 border border-zinc-200"
            } border rounded px-1`}
            onClick={() => setSelectedTab("media")}
          >
            Media
          </button>
          <button
            className={`font-medium ${
              selectedTab === "members" && "bg-slate-100 border border-zinc-200"
            } border rounded px-1`}
            onClick={() => setSelectedTab("members")}
          >
            Members
          </button>
          <button
            className={`font-medium ${
              selectedTab === "addMembers" &&
              "bg-slate-100 border border-zinc-200"
            } border rounded px-1`}
            onClick={() => setSelectedTab("addMembers")}
          >
            Add Members
          </button>
        </div>

        <div className="p-2 rounded-md h-90 overflow-scroll shadow bg-slate-50 border border-slate-400">
          {selectedTab === "media" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 gap-y-4 p-2">
              {msgImages.length > 0 ? (
                msgImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="media"
                    className="hover:scale-105 duration-200 object-cover min-[1400]:size-32 2xl:size-40 shadow-xl"
                    onClick={() => window.open(image)}
                  />
                ))
              ) : (
                <span>No media</span>
              )}
            </div>
          )}

          {selectedTab === "members" && (
            <ul>
              {groupSelected?.members.map((member) => (
                <GroupMembersCard member={member} key={member._id} />
              ))}
            </ul>
          )}

          {selectedTab === "addMembers" && (
            <ul>
              {friends?.length > 0 ? (
                friends.map((friend) => (
                  <GroupAddMemberCard
                    key={friend._id}
                    friend={friend}
                    selected={selectedFriends.includes(friend._id)}
                    onSelect={handleSelectFriend}
                  />
                ))
              ) : (
                <p>No friends available to add.</p>
              )}
            </ul>
          )}
        </div>
        {selectedTab === "addMembers" && (
          <button
            onClick={addToGroupHandler}
            disabled={selectedFriends.length < 1}
            className="w-full bg-purple-600 text-white my-1 rounded py-1"
          >
            Add {selectedFriends.length} people
          </button>
        )}
      </div>
    </section>
  );
};

export default GroupRightSideBar;
