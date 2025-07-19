import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { setGroupSelected } from "../../Store/Slices/Group-slice";
import MessageBox from "./MessageBox";
import type { Message } from "../../types/models";
import { useListenGroupMessage } from "../Hooks/useListenGroupMessages";
import { useFetchAndSend } from "../Hooks/useFetchAndSendMessage";
import useJoinAllGroups from "../Hooks/useJoinLeaveGroup";
import EmptyState from "./EmptyState";
import SendMessageBoxGroup from "./SendMessageBoxGroup";

const GroupContainer = () => {
  const { groupSelected, selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState<boolean>(false);
  const divTillScroll = useRef<HTMLDivElement>(null);
  const { fetchGroupMessages, groupMessageLoading } = useFetchAndSend();

  //* useEffect to fetch selected group messages
  useEffect(() => {
    //*Fetching group messages and images
    if (groupSelected) {
      fetchGroupMessages(groupSelected?._id);
    }
  }, [groupSelected]);

  //* custom-hook to listen/Subscribe to group messages
  useListenGroupMessage();

  //Join to group
  useJoinAllGroups();

  //* useEffect to scroll to latest message
  useEffect(() => {
    if (divTillScroll && divTillScroll.current && groupSelected) {
      divTillScroll.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [groupSelected, selectedGroupMessages, uploading]);

  return (
    <section
      className={`w-full h-screen max-w-6xl flex flex-col bg-white rounded-lg shadow-md transition-all
  ${
    groupSelected
      ? "min-[1430px]:min-w-[868px] max-[1430px]:min-w-[760px] max-[1270px]:min-w-[660px] max-[900px]:min-w-full"
      : "max-sm:hidden"
  }`}
    >
      {groupSelected ? (
        <div className="flex flex-col h-full ">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
            <div
              onClick={() => navigate(`/chat/mobile/group-profile`)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={groupSelected.profile.profilePhoto || "/avatar_icon.png"}
                alt="Friend"
                className="size-10 rounded-full object-cover"
              />
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>{groupSelected.name}</span>
              </div>
            </div>
            <IoArrowBackSharp
              onClick={() => dispatch(setGroupSelected(null))}
              className="text-xl cursor-pointer hover:scale-110 transition"
            />
          </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto px-2 py-2 bg-[url('/chatbg.jpg')] bg-cover">
            {groupMessageLoading ? (
              <div className="h-full grid place-items-center text-lg text-gray-500">
                <span className="loader2" />
              </div>
            ) : (
              selectedGroupMessages?.map((message: Message) => (
                <MessageBox message={message} key={message._id} />
              ))
            )}

            {uploading && (
              <div className="text-center text-xs text-gray-400">
                Sending image...
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={divTillScroll} />
          </div>

          {/* Send Message Box */}
          <div className="border-t  bg-white px-2 ">
            <SendMessageBoxGroup
              setUploading={setUploading}
              uploading={uploading}
            />
          </div>
        </div>
      ) : (
        // Empty state when no user selected
        <EmptyState />
      )}
    </section>
  );
};

export default GroupContainer;
