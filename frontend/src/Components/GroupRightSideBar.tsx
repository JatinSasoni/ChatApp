import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../../Store/store";
import GroupMembersCard from "./GroupMembersCard"; // assuming this exists
import GroupAddMemberCard from "./GroupAddMemberCard";
import { FaUserEdit } from "react-icons/fa";
import { api } from "../../Api/axios";
import toast from "react-hot-toast";
import {
  setAllGroups,
  setGroupSelected,
  setGroupUpdateBoxOpen,
} from "../../Store/Slices/Group-slice";
import axios from "axios";

const GroupRightSideBar = () => {
  const dispatch = useDispatch();
  const { groupSelected, selectedGroupMessages, groups } = useSelector(
    (state: RootState) => state.group
  );
  const { friends } = useSelector((state: RootState) => state.friendship);
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const [msgImages, setMsgImages] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "media" | "members" | "addMembers"
  >("members");

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
    try {
      const response = await api.post(
        `/api/v1/groups/${groupSelected?._id}/add-members`,
        {
          members: selectedFriends,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Added to group");
        dispatch(setGroupSelected(response.data?.group));
        dispatch(
          setAllGroups([
            ...groups.map((group) =>
              group._id === response.data?.group._id
                ? response.data?.group
                : group
            ),
          ])
        );
        setSelectedFriends([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
      }
    }
  };

  return (
    <section
      className={`${
        !groupSelected && "hidden"
      } h-screen px-2 border border-gray-500 rounded w-full`}
    >
      {/* Main container */}
      <div className="h-screen">
        <div className="flex justify-between">
          <p className="text-xl">Profile</p>
          {/* HERE COMES ICON FOR UPDATE GROUP INFO */}
          <button onClick={() => dispatch(setGroupUpdateBoxOpen(true))}>
            <FaUserEdit className="my-auto text-black size-6" />
          </button>
        </div>
        {/* Profile,Admin */}
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
            } border border-zinc-100 rounded px-1`}
            onClick={() => setSelectedTab("media")}
          >
            Media
          </button>
          <button
            className={`font-medium ${
              selectedTab === "members" && "bg-slate-100 border border-zinc-200"
            } border border-zinc-100 rounded px-1`}
            onClick={() => setSelectedTab("members")}
          >
            Members
          </button>
          <button
            className={`font-medium ${
              selectedTab === "addMembers" &&
              "bg-slate-100 border border-zinc-200"
            } border border-zinc-100 rounded px-1`}
            onClick={() => setSelectedTab("addMembers")}
          >
            Add Friends
          </button>
        </div>
        {/* Selected Tab content */}
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
                <GroupMembersCard
                  member={member}
                  key={member._id}
                  isAdmin={groupSelected.admin._id === loggedInUser?._id}
                  groupId={groupSelected._id}
                />
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
        {/* Add to group button */}
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
