import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../../chat-app-assets/assets";
import { convertToLocaleFormat } from "../../Utils/LocalDateFormat";
import type { Message } from "../../types/models";
import type { AppDispatch, RootState } from "../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../Api/axios";
import axios from "axios";
import {
  setSelectedUserMsgs,
  setUnseenMessages,
} from "../../Store/Slices/message-slice";
import { socketContext } from "../../ContextForSocket/context";

const MessagesContainer: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const divTillScroll = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { userSelected, selectedUserMessages, unseenMessages } = useSelector(
    (state: RootState) => state.message
  );
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const SocketContext = useContext(socketContext);

  const fetchUserMessages = async () => {
    try {
      const response = await api.get(`/api/v1/message/${userSelected?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        dispatch(setSelectedUserMsgs(response?.data.selectedUserMessages));
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  //*sendMessageHandler
  const sendMessageHandler = async () => {
    if (input.trim() == "") return;
    try {
      const response = await api.post(
        `api/v1/message/send/${userSelected?._id}`,
        { text: input, image: "" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(
          setSelectedUserMsgs([
            ...(selectedUserMessages || []), //COZ TYPE OF selectedUserMessages could be of null type
            response.data.newMessage,
          ])
        );
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    } finally {
      setInput("");
    }
  };

  //* useEffect to fetch selected user's messages
  useEffect(() => {
    if (userSelected) {
      fetchUserMessages();
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
  //* useEffect to subscribe to messages
  useEffect(() => {
    if (SocketContext?.socket) {
      SocketContext.socket.on("newMessage", (newMessage: Message) => {
        if (userSelected && userSelected._id === newMessage.senderId) {
          dispatch(
            setSelectedUserMsgs([
              ...(selectedUserMessages || []),
              { ...newMessage, seen: true },
            ])
          );

          //call seen message  api
        } else {
          dispatch(
            setUnseenMessages({
              ...unseenMessages,
              [newMessage.senderId]: unseenMessages[newMessage.senderId]
                ? unseenMessages[newMessage.senderId] + 1
                : 1,
            })
          );
        }
      });
    }
    return () => {
      if (SocketContext?.socket) {
        SocketContext.socket.off("newMessage");
      }
    };
  }, [
    SocketContext?.socket,
    userSelected,
    dispatch,
    SocketContext,
    selectedUserMessages,
    unseenMessages,
  ]);

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
                    src={assets.avatar_icon}
                    alt="Friends-avatar"
                    className="size-10"
                  />
                  <p>{userSelected?.username}</p>
                  <div className="size-2 bg-green-400 rounded-full"></div>
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

              <div ref={divTillScroll}></div>
            </div>
            {/* SendMessage */}
            <div className="flex m-1">
              <input
                type="text"
                className="w-full rounded outline-none border border-white text-white px-2"
                placeholder="Your message... "
                name="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="px-2 text-white bg-blue-300 rounded-sm mx-2"
                onClick={sendMessageHandler}
              >
                Send
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
