import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useContext, useEffect } from "react";
import { socketContext } from "../../ContextForSocket/context";
import type { Message } from "../../types/models";
import { setSelectedGroupMessages } from "../../Store/Slices/Group-slice";

export const useListenGroupMessage = () => {
  const { groupSelected, selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );
  const dispatch = useDispatch();
  const SocketContext = useContext(socketContext);

  //* LISTEN
  useEffect(() => {
    if (SocketContext?.socket) {
      SocketContext.socket.on(
        "groupMessage",
        async ({ newMessage }: { newMessage: Message }) => {
          //*IF RECEIVER HAS OPENED SELECTED GROUP CHAT THEN SHOW MESSAGE OTHERWISE UPDATE UNSEEN MESSAGES
          if (groupSelected && groupSelected._id === newMessage.groupId) {
            dispatch(
              setSelectedGroupMessages([
                ...(selectedGroupMessages || []),
                { ...newMessage, seen: true }, //MARKING MESSAGE AS SEEN ON FRONTEND
              ])
            );

            // MARKING MESSAGE AS SEEN ON BACKEND
            // await api.put(`/api/v1/message/mark/${newMessage._id}`, "", {
            //   headers: {
            //     Authorization: `Bearer ${localStorage.getItem("token")}`,
            //   },
            // });
          } else {
            // dispatch(
            //   setUnseenMessages({
            //     ...unseenMessages,
            //     [newMessage.senderId]: unseenMessages[newMessage.senderId]
            //       ? unseenMessages[newMessage.senderId] + 1
            //       : 1,
            //   })
            // );
          }
        }
      );
    }
    return () => {
      if (SocketContext?.socket) {
        SocketContext.socket.off("newMessage");
      }
    };
  }, [
    SocketContext?.socket,
    groupSelected,
    dispatch,
    SocketContext,
    selectedGroupMessages,
    // unseenMessages,
  ]);
};
