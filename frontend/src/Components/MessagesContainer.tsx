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

const MessagesContainer: React.FC = () => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState<boolean>(false);
  const divTillScroll = useRef<HTMLInputElement>(null);
  const { userSelected, selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { fetchUserMessagesHandler } = useFetchAndSend(); //CUSTOM HOOK

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

  return (
    <section
      className={`max-sm:h-[calc(100vh)] shadow-lg sm:mx-2 ${
        userSelected
          ? "sm:min-w-4xl"
          : "place-items-center w-full max-sm:hidden "
      }  `}
    >
      {userSelected ? (
        <div className="max-sm:h-full rounded sm:h-full ">
          {/* Main container */}
          <div className="max-sm:h-full flex flex-col">
            {/* header */}
            <header className="sticky top-0 shadow-md z-10">
              <div className="py-3 pl-3 flex justify-between">
                <div className="flex items-center gap-2 ">
                  <img
                    src={
                      userSelected.Profile.profilePhoto || "/avatar_icon.png"
                    }
                    alt="Friends-avatar"
                    className="size-10 rounded-full"
                  />
                  <p>{userSelected?.username}</p>
                  {onlineUsers.includes(userSelected._id) && (
                    <div className="size-2 bg-green-400 rounded-full"></div>
                  )}
                </div>
                <IoArrowBackSharp
                  onClick={() => dispatch(setUserSelected(null))}
                  className="my-auto mr-6 size-6 hover:scale-105 duration-200"
                />
              </div>
            </header>
            {/* Scrollable messages container */}
            <div className="overflow-y-scroll max-sm:h-[calc(100vh-60px)] sm:h-[580px] bg-neutral-100 rounded-md">
              {selectedUserMessages?.map((message: Message, i: number) => {
                return <MessageBox message={message} key={i} />;
              })}
              {uploading && (
                <div className="text-sm  m-2 text-center ">
                  sending image...
                </div>
              )}
              {/* DIV TO GET TO LATEST MESSAGES */}
              <div ref={divTillScroll}></div>
            </div>
            {/* SendMessage */}
            <SendMessageBox setUploading={setUploading} uploading={uploading} />
          </div>
        </div>
      ) : (
        <div className="max-sm:hidden sm:h-full sm:w-full p-2 grid place-items-center bg-slate-50">
          <img
            src="../../src/assets/logo_big.svg"
            alt="logo"
            className="w-2/5 drop-shadow-xl "
          />
        </div>
      )}
    </section>
  );
};

export default MessagesContainer;
