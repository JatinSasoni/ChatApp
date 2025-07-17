import { useContext, useEffect } from "react";
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

  useEffect(() => {
    if (!SocketContext?.socket) return;

    const handleNewMessage = async (newMessage: Message) => {
      console.log(newMessage);

      if (userSelected && userSelected._id === newMessage.senderId) {
        dispatch(
          setSelectedUserMsgs([
            ...(selectedUserMessages || []),
            { ...newMessage, seenBy: loggedInUser ? [loggedInUser._id] : [] },
          ])
        );

        await api.put(`/api/v1/message/mark/${newMessage._id}`, "");
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
    };

    SocketContext.socket.on("newMessage", handleNewMessage);

    return () => {
      SocketContext.socket?.off("newMessage", handleNewMessage);
    };
  }, [
    SocketContext?.socket,
    userSelected,
    loggedInUser,
    dispatch,
    selectedUserMessages,
    unseenMessages,
  ]);
};
