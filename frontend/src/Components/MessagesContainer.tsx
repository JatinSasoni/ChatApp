import React, { useEffect, useRef, useState } from "react";
import type { Message } from "../../types/models";
import { useSelector } from "react-redux";
import { useFetchAndSend } from "../Hooks/fetchAndSendMessage";
import { useListenMessage } from "../Hooks/useListenMessage";
import type { RootState } from "../../Store/store";
import SendMessageBox from "./SendMessageBox";
import MessageBox from "./MessageBox";

const MessagesContainer: React.FC = () => {
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
      className={`grid ${
        userSelected ? "col-span-2" : "place-items-center "
      }  `}
    >
      {userSelected ? (
        <div className="shadow-2xl rounded ">
          {/* Main container */}
          <div className="flex flex-col ">
            {/* header */}
            <header className="sticky top-0 bg-zinc-700 z-10">
              <div className="py-3 pl-3">
                <div className="flex items-center gap-2 text-white">
                  <img
                    src={
                      userSelected.Profile.profilePhoto || "/avatar_icon.png"
                    }
                    alt="Friends-avatar"
                    className="size-10"
                  />
                  <p>{userSelected?.username}</p>
                  {onlineUsers.includes(userSelected._id) && (
                    <div className="size-2 bg-green-400 rounded-full"></div>
                  )}
                </div>
              </div>
            </header>
            {/* Scrollable messages container */}
            <div className="overflow-y-scroll text-white h-[500px]  ">
              {selectedUserMessages?.map((message: Message, i: number) => {
                return <MessageBox message={message} key={i} />;
              })}
              {uploading && (
                <div className="text-sm  m-2 text-center text-white">
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
        <img
          src="../../src/assets/logo_big.svg"
          alt="logo"
          className="w-2/3 "
        />
      )}
    </section>
  );
};

export default MessagesContainer;
