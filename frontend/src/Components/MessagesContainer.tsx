import React, { useEffect, useRef, useState } from "react";
import assets from "../../chat-app-assets/assets";
import { convertToLocaleFormat } from "../../Utils/LocalDateFormat";
import type { Message } from "../../types/models";
import { useSelector } from "react-redux";
import { useFetchAndSend } from "../Hooks/fetchAndSendMessage";
import { useListenMessage } from "../Hooks/useListenMessage";
import type { RootState } from "../../Store/store";

const MessagesContainer: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const divTillScroll = useRef<HTMLInputElement>(null);
  const { userSelected, selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );
  const { loggedInUser, onlineUsers } = useSelector(
    (state: RootState) => state.auth
  );
  const { fetchUserMessagesHandler, sendMessage } = useFetchAndSend(); //CUSTOM HOOK

  //* SEND MESSAGE HANDLER
  const sendMessageHandler = () => {
    if (input.trim() === "") return;
    sendMessage(input.trim(), userSelected?._id);
    setInput("");
  };

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
  }, [userSelected, selectedUserMessages]);

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
          {/*user-info */}
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
                return (
                  <div
                    key={i}
                    className={`m-2 py-1 flex ${
                      message.senderId === loggedInUser?._id
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    {message.image ? (
                      <div>
                        <img
                          src="../../../chat-app-assets/img1.jpg"
                          className="size-40"
                        />
                        <p
                          className={`text-xs ${
                            message.senderId === loggedInUser?._id && "text-end"
                          } `}
                        >
                          {convertToLocaleFormat(message.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="break-all max-w-60 bg-zinc-800 text-white p-2 rounded-xl">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs ${
                            message.senderId === loggedInUser?._id && "text-end"
                          } `}
                        >
                          {convertToLocaleFormat(message.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* DIV TO GET TO LATEST MESSAGES */}
              <div ref={divTillScroll}></div>
            </div>
            {/* SendMessage */}
            <div className="flex m-1">
              <input
                type="text"
                className="w-full rounded outline-none border border-white text-white pl-2"
                placeholder="Your message... "
                name="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <label htmlFor="image" className="mx-2 grid place-items-center">
                <img src={assets.gallery_icon} className="size-7" />
              </label>
              <input
                type="file"
                id="image"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
              />

              <button onClick={sendMessageHandler}>
                <img src={assets.send_button} alt="send" className="size-8" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <img src={assets.logo_big} alt="logo" className="w-2/3 " />
      )}
    </section>
  );
};

export default MessagesContainer;
