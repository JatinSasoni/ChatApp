import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Store/store";
import { useContext, useEffect } from "react";
import { socketContext } from "../../ContextForSocket/context";
import type { Message } from "../../types/models";
import {
  setSelectedGroupMessages,
  setUnseenMessages,
} from "../../Store/Slices/Group-slice";
import { api } from "../../Api/axios";

export const useListenGroupMessage = () => {
  const { groupSelected, selectedGroupMessages, unseenMessages } = useSelector(
    (state: RootState) => state.group
  );
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const SocketContext = useContext(socketContext);

  useEffect(() => {
    if (!SocketContext?.socket) return;

    const handleGroupMessage = async ({
      newMessage,
    }: {
      newMessage: Message;
    }) => {
      if (groupSelected && groupSelected._id === newMessage.groupId) {
        dispatch(
          setSelectedGroupMessages([
            ...(selectedGroupMessages || []),
            { ...newMessage, seenBy: loggedInUser ? [loggedInUser._id] : [] }, // mark as seen
          ])
        );
        // Mark message as seen on backend
        await api.put(`/api/v1/groups/mark/${newMessage._id}`, "");
      } else {
        dispatch(
          setUnseenMessages({
            ...unseenMessages,
            [newMessage.groupId]: unseenMessages[newMessage.groupId]
              ? unseenMessages[newMessage.groupId] + 1
              : 1,
          })
        );
      }
    };

    SocketContext.socket?.on("groupMessage", handleGroupMessage);

    return () => {
      SocketContext.socket?.off("groupMessage", handleGroupMessage);
    };
  }, [
    SocketContext?.socket,
    groupSelected,
    dispatch,
    selectedGroupMessages,
    unseenMessages,
    loggedInUser,
  ]);
};
