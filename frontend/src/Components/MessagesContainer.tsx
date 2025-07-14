import React, { useEffect, useRef, useState } from "react";
import type { Message } from "../../types/models";
import { useDispatch, useSelector } from "react-redux";
import { useFetchAndSend } from "../Hooks/fetchAndSendMessage";
import { useListenMessage } from "../Hooks/useListenMessage";
import type { RootState } from "../../Store/store";
import SendMessageBox from "./SendMessageBox";
import { IoArrowBackSharp } from "react-icons/io5";
import MessageBox from "./MessageBox";
import { setUserSelected } from "../../Store/Slices/message-slice";
import { useNavigate } from "react-router-dom";

const MessagesContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState<boolean>(false);
  const divTillScroll = useRef<HTMLDivElement>(null);
  const { userSelected, selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { fetchUserMessagesHandler, messageLoading } = useFetchAndSend(); //CUSTOM HOOK

  //* useEffect to fetch selected user's messages
  useEffect(() => {
    if (userSelected) {
      fetchUserMessagesHandler(userSelected._id);
    }
  }, [userSelected]);

  //* useEffect to scroll to latest message
  useEffect(() => {
    if (divTillScroll && divTillScroll.current && userSelected) {
      divTillScroll.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [userSelected, selectedUserMessages, uploading]);

  //* custom-hook to listen/Subscribe to messages
  useListenMessage();
  console.log("container");

  return (
    <section
      className={`h-full w-full flex flex-col bg-white rounded-lg shadow-md transition-all
  ${
    userSelected
      ? "min-[1430px]:min-w-[868px] max-[1430px]:min-w-[760px] max-[1270px]:min-w-[660px] max-[900px]:min-w-full"
      : "max-sm:hidden"
  }`}
    >
      {userSelected ? (
        <div className="flex flex-col h-full ">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
            <div
              onClick={() => navigate(`/chat/mobile/profile`)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={userSelected.Profile.profilePhoto || "/avatar_icon.png"}
                alt="Friend"
                className="size-10 rounded-full object-cover"
              />
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>{userSelected.username}</span>
                {onlineUsers.includes(userSelected._id) && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
            </div>
            <IoArrowBackSharp
              onClick={() => dispatch(setUserSelected(null))}
              className="text-xl cursor-pointer hover:scale-110 transition"
            />
          </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto px-2 py-2 bg-[url('/chatbg.jpg')] bg-cover">
            {messageLoading ? (
              <div className="h-full grid place-items-center text-lg text-gray-500">
                <span className="loader2" />
              </div>
            ) : (
              selectedUserMessages?.map((message: Message, index: number) => (
                <MessageBox message={message} key={index} />
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
            <SendMessageBox uploading={uploading} setUploading={setUploading} />
          </div>
        </div>
      ) : (
        // Empty state when no user selected
        <div className="hidden sm:flex flex-col items-center justify-center w-full h-full bg-gray-100 p-6">
          <img
            src="/logo_big.svg"
            alt="Chat Logo"
            className="w-80 mb-4 drop-shadow-md"
          />
          <p className="text-gray-500 text-sm">
            Select a conversation to get started
          </p>
        </div>
      )}
    </section>
  );
};

export default MessagesContainer;
