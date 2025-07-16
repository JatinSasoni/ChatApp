import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useEffect, useState } from "react";
import GroupMembersCard from "./GroupMembersCard";

const GroupRightSideBar = () => {
  const { groupSelected, selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );
  const [msgImages, setMsgImages] = useState<string[] | undefined>([]);
  const [isMediaSelected, setIsMediaSelected] = useState<boolean>(false);

  useEffect(() => {
    setMsgImages(() =>
      selectedGroupMessages?.filter((msg) => msg.image).map((msg) => msg.image)
    );
  }, [selectedGroupMessages, groupSelected]);
  console.log(groupSelected);

  return (
    <section className="h-screen px-2 border border-gray-500 rounded w-full">
      <div className="h-full">
        <div className="flex justify-between px-2 ">
          <p className="text-xl">Profile</p>
          {/* {alreadyFriend ? (
            ""
          ) : loading ? (
            <div className="border-t-2 border-b-2 rounded-full p-3 animate-spin"></div>
          ) : (
            <button
              onClick={() => sendRequestHandler(userSelected?._id)}
              aria-label="Send Friend Request"
            >
              <IoPersonAddSharp className="my-auto hover:scale-110 duration-200 size-5" />
            </button>
          )} */}
        </div>
        {/* PFP */}
        <div className="my-2 ">
          <img
            src={groupSelected?.profile?.profilePhoto || "/avatar_icon.png"}
            alt="Profile_Pic"
            className="size-40 rounded-full mx-auto cursor-pointer object-cover "
            onClick={() =>
              groupSelected?.profile?.profilePhoto &&
              window.open(groupSelected?.profile?.profilePhoto)
            }
          />
          <p className="text-2xl mt-2 text-center">
            {groupSelected?.name || "Group"}
          </p>
          <p className="text-sm text-center ">
            {`Admin - ${groupSelected?.admin.username}`}
          </p>
        </div>
        {/* Media */}
        <div className="flex gap-2 my-1">
          <button
            className={`font-medium ${
              isMediaSelected && "bg-slate-100 border border-zinc-200 "
            } border rounded px-1 border-zinc-50`}
            onClick={() => setIsMediaSelected(true)}
          >
            Media
          </button>
          <button
            className={`font-medium ${
              !isMediaSelected && "bg-slate-100  border-zinc-200 "
            } border rounded px-1 border-zinc-50 `}
            onClick={() => setIsMediaSelected(false)}
          >
            Members
          </button>
        </div>
        <div className="p-2 rounded-md h-90 overflow-scroll shadow bg-slate-50 border border-slate-400">
          {isMediaSelected ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 gap-y-4 p-2 ">
              {msgImages && msgImages.length > 0 ? (
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
          ) : (
            <ul>
              {groupSelected?.members.map((member) => {
                return <GroupMembersCard member={member} key={member._id} />;
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default GroupRightSideBar;
