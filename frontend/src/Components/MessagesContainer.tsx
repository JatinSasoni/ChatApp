import React, { useEffect, useRef, useState } from "react";
import type { Message } from "../../types/models";
import { useDispatch, useSelector } from "react-redux";
import { useFetchAndSend } from "../Hooks/useFetchAndSendMessage";
import { useListenMessage } from "../Hooks/useListenMessage";
import type { RootState } from "../../Store/store";
import SendMessageBox from "./SendMessageBox";
import { IoArrowBackSharp } from "react-icons/io5";
import MessageBox from "./MessageBox";
import { setUserSelected } from "../../Store/Slices/message-slice";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";

const MessagesContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [canObserveTop, setCanObserveTop] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef<boolean>(false);
  const { userSelected, selectedUserMessages, nextCursor, hasMore } =
    useSelector((state: RootState) => state.message);
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { fetchUserMessagesHandler, messageLoading } = useFetchAndSend();

  // Reset scroll state when switching users
  useEffect(() => {
    if (userSelected) {
      setCanObserveTop(false);
      didInitialScrollRef.current = false;
    }
  }, [userSelected?._id]);

  // Fetch selected user's messages on user change (initial load without cursor)
  useEffect(() => {
    if (userSelected) {
      fetchUserMessagesHandler(userSelected._id, undefined, true);
    }
  }, [userSelected?._id]);

  // Scroll to bottom only on initial load so sentinel is off-screen; then allow infinite-scroll observer
  useEffect(() => {
    if (
      messageLoading ||
      !selectedUserMessages?.length ||
      didInitialScrollRef.current
    )
      return;
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight - el.clientHeight;
      didInitialScrollRef.current = true;
      setCanObserveTop(true);
    }
  }, [messageLoading, selectedUserMessages?.length]);

  // Infinite scroll: load older messages when user scrolls to top (only after initial scroll to bottom)
  useEffect(() => {
    if (
      !topSentinelRef.current ||
      !scrollContainerRef.current ||
      !hasMore ||
      !nextCursor ||
      !userSelected ||
      messageLoading ||
      selectedUserMessages?.length === 0 ||
      !canObserveTop
    )
      return;

    const root = scrollContainerRef.current;
    const sentinel = topSentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || loadingMore) return;

        const container = scrollContainerRef.current;
        if (!container) return;
        setLoadingMore(true);
        const previousHeight = container.scrollHeight;
        fetchUserMessagesHandler(userSelected._id, nextCursor, false)
          .then(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTop =
                    scrollContainerRef.current.scrollHeight - previousHeight;
                }
              });
            });
          })
          .finally(() => setLoadingMore(false));
      },
      {
        root,
        rootMargin: "0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    hasMore,
    nextCursor,
    userSelected?._id,
    loadingMore,
    messageLoading,
    selectedUserMessages?.length,
    canObserveTop,
    fetchUserMessagesHandler,
  ]);

  //* custom-hook to listen/Subscribe to messages
  useListenMessage();

  //* useEffect to scroll to latest message
  // const divTillScroll = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (divTillScroll && divTillScroll.current && userSelected) {
  //     divTillScroll.current.scrollIntoView({
  //       behavior: "smooth",
  //     });
  //   }
  // }, [userSelected, selectedUserMessages, uploading]);

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
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 bg-[url('/chatbg.jpg')] bg-cover"
          >
            {/* Single sentinel at top for infinite scroll; only meaningful when we have messages */}
            {selectedUserMessages && selectedUserMessages.length > 0 && (
              <div
                ref={topSentinelRef}
                style={{ height: 1, minHeight: 1 }}
                aria-hidden="true"
              />
            )}
            {/* Full-screen loader only on initial load (no messages yet); otherwise show list */}
            {messageLoading && !selectedUserMessages?.length ? (
              <div className="h-full grid place-items-center text-lg text-gray-500">
                <span className="loader2" />
              </div>
            ) : (
              <>
                {loadingMore && (
                  <div className="py-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span
                      className="loader2"
                      style={{ width: 18, height: 18 }}
                    />
                    <span>Loading older messages...</span>
                  </div>
                )}
                {selectedUserMessages?.map((message: Message) => (
                  <MessageBox message={message} key={message._id} />
                ))}
              </>
            )}

            {uploading && (
              <div className="text-center text-xs text-gray-400">
                Sending image...
              </div>
            )}

            {/* Scroll anchor */}
            {/* <div ref={divTillScroll} /> */}
          </div>

          {/* Send Message Box */}
          <div className="border-t  bg-white px-2 ">
            <SendMessageBox uploading={uploading} setUploading={setUploading} />
          </div>
        </div>
      ) : (
        // Empty state when no user selected
        <EmptyState />
      )}
    </section>
  );
};

export default MessagesContainer;
