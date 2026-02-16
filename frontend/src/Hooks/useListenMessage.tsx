import { useContext, useEffect, useRef } from "react";
import { socketContext } from "../../ContextForSocket/context";
import type { Message } from "../../types/models";
import {
  setSelectedUserMsgs,
  setUnseenMessages,
} from "../../Store/Slices/message-slice";
import { api } from "../../Api/axios";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Store/store";

export const useListenMessage = () => {
  const { userSelected, selectedUserMessages, unseenMessages } = useSelector(
    (state: RootState) => state.message
  );
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const SocketContext = useContext(socketContext);

  const messagesRef = useRef(selectedUserMessages);
  const unseenRef = useRef(unseenMessages);
  messagesRef.current = selectedUserMessages;
  unseenRef.current = unseenMessages;

  useEffect(() => {
    if (!SocketContext?.socket) return;

    const handleNewMessage = async (newMessage: Message) => {
      const currentUser = userSelected;
      const currentMessages = messagesRef.current;
      const currentUnseen = unseenRef.current;
      if (currentUser && currentUser._id === newMessage.senderId._id) {
        dispatch(
          setSelectedUserMsgs([
            ...(currentMessages || []),
            { ...newMessage, seenBy: loggedInUser ? [loggedInUser._id] : [] },
          ])
        );
        await api.put(`/api/v1/message/mark/${newMessage._id}`, "");
      } else {
        dispatch(
          setUnseenMessages({
            ...currentUnseen,
            [newMessage.senderId._id]: currentUnseen[newMessage.senderId._id]
              ? currentUnseen[newMessage.senderId._id] + 1
              : 1,
          })
        );
      }
    };

    SocketContext.socket.on("newMessage", handleNewMessage);
    return () => {
      SocketContext.socket?.off("newMessage", handleNewMessage);
    };
  }, [SocketContext?.socket, userSelected, loggedInUser, dispatch]);
};
