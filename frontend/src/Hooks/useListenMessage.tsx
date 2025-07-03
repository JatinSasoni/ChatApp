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
  const dispatch = useDispatch<AppDispatch>();
  const SocketContext = useContext(socketContext);

  //* LISTEN
  useEffect(() => {
    if (SocketContext?.socket) {
      SocketContext.socket.on("newMessage", async (newMessage: Message) => {
        //*IF RECEIVER HAS OPENED SELECTED USERS CHAT THEN SHOW MESSAGE OTHERWISE UPDATE UNSEEN MESSAGES
        if (userSelected && userSelected._id === newMessage.senderId) {
          dispatch(
            setSelectedUserMsgs([
              ...(selectedUserMessages || []),
              { ...newMessage, seen: true }, //MARKING MESSAGE AS SEEN ON FRONTEND
            ])
          );

          //MARKING MESSAGE AS SEEN ON BACKEND
          await api.put(`/api/v1/message/mark/${newMessage._id}`, "", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
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
};
