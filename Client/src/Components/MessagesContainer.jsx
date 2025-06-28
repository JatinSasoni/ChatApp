import React, { useEffect, useRef } from "react";
import assets, {
  messagesDummyData,
  userDummyData,
} from "../../chat-app-assets/assets";
import { convertToLocaleFormat } from "../../Utils/LocalDateFormat";

const MessagesContainer = ({ userSelected, setUserSelected }) => {
  const messageInputRef = useRef();

  useEffect(() => {
    if (messageInputRef.current && userSelected) {
      messageInputRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [userSelected]);

  return (
    <section
      className={`grid ${
        userSelected ? "col-span-2" : "place-items-center "
      }  `}
    >
      {!userSelected ? (
        <img src={assets.logo_big} alt="logo" className="w-2/3 " />
      ) : (
        <div className="shadow-2xl rounded ">
          {/* user-info */}
          {/* Main container */}
          <div className="flex flex-col ">
            {/* header */}
            <header className="sticky top-0 bg-zinc-700 z-10">
              <div className="py-3 pl-3">
                <div className="flex items-center gap-2 text-white">
                  <img
                    src={assets.avatar_icon}
                    alt="Friends-avatar"
                    className="size-10"
                  />
                  <p>Ashmika Singh</p>
                  <div className="size-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </header>
            {/* Scrollable messages container */}
            <div className="overflow-y-scroll text-white h-[530px]  ">
              {messagesDummyData.map((message, i) => {
                return (
                  <div
                    key={i}
                    className={`m-2 py-1 flex ${
                      message.senderId === "680f5116f10f3cd28382ed02"
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="break-all max-w-60 bg-zinc-800 text-white p-2 rounded-xl">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs ${
                          message.receiverId === "680f50e4f10f3cd28382ecf9" &&
                          "text-end"
                        } `}
                      >
                        {convertToLocaleFormat(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* SendMessage */}
              <div className="flex m-1 ">
                <input
                  type="text"
                  className=" w-full rounded outline-none border border-white text-white px-2"
                  placeholder="Your message... "
                  ref={messageInputRef}
                />
                <button className="px-2 text-white bg-blue-300 rounded-sm mx-2">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MessagesContainer;
