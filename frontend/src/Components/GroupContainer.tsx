import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { setGroupSelected } from "../../Store/Slices/Group-slice";
import MessageBox from "./MessageBox";
import type { Message } from "../../types/models";
import { useListenGroupMessage } from "../Hooks/useListenGroupMessages";
import { TfiGallery } from "react-icons/tfi";
import { useFetchAndSend } from "../Hooks/fetchAndSendMessage";
import useJoinAllGroups from "../Hooks/useJoinLeaveGroup";
import CreateGroup from "./CreateGroup";

const GroupContainer = () => {
  const { groupSelected, selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);
  const divTillScroll = useRef<HTMLDivElement>(null);
  // const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { fetchGroupMessages, groupMessageLoading, sendMessageGroup } =
    useFetchAndSend();

  //* useEffect to fetch selected group messages
  useEffect(() => {
    //*Fetching group messages and images
    if (groupSelected) {
      fetchGroupMessages(groupSelected?._id);
    }
  }, [groupSelected]);

  //* useEffect to scroll to latest message
  useEffect(() => {
    if (divTillScroll && divTillScroll.current && groupSelected) {
      divTillScroll.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [groupSelected, selectedGroupMessages, uploading]);

  //* custom-hook to listen/Subscribe to group messages
  useListenGroupMessage();

  //* SEND MESSAGE HANDLER
  const sendMessageHandler = () => {
    if (input.trim() === "") return;
    sendMessageGroup(input.trim(), groupSelected?._id);
    setInput("");
  };

  //Join to group
  useJoinAllGroups();

  //* SEND IMAGE
  const sendImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file || !groupSelected?._id) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      const result = reader.result as string;
      await sendMessageGroup("", groupSelected?._id, result);
      e.target.value = "";
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

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
              onClick={() => navigate(`/chat/mobile/profile`)}
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
            <div className="flex m-1 p-1">
              <input
                type="text"
                disabled={uploading}
                autoComplete="off"
                className="w-full h-10 rounded-xl outline-none bg-neutral-100 pl-2 border"
                placeholder="Your message... "
                name="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" ? sendMessageHandler() : null
                }
              />
              <label htmlFor="image" className="mx-2 grid place-items-center">
                <TfiGallery className="size-6 hover:scale-105" />
              </label>
              <input
                type="file"
                id="image"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
                onChange={sendImageHandler}
              />

              <button onClick={sendMessageHandler} disabled={uploading}>
                <img src="/send_button.svg" alt="send" className="size-8" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty state when no user selected
        <CreateGroup />
      )}
    </section>
  );
};

export default GroupContainer;
