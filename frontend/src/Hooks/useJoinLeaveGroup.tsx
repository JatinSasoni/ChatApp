import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useContext, useEffect } from "react";
import { socketContext } from "../../ContextForSocket/context";

const useJoinAllGroups = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const { groups } = useSelector((state: RootState) => state.group); // assuming you store all groups here
  const SocketContext = useContext(socketContext);

  useEffect(() => {
    if (!SocketContext?.socket || !loggedInUser) return;

    const groupIds = groups.map((group) => group._id);

    if (groups.length) {
      SocketContext.socket.emit("joinMultipleGroups", {
        groupIds,
        username: loggedInUser.username,
      });
    }

    return () => {
      if (groups.length) {
        SocketContext.socket?.emit("leaveMultipleGroups", {
          groupIds,
          username: loggedInUser.username,
        });
      }
    };
  }, [SocketContext?.socket, groups, loggedInUser]);
};

export default useJoinAllGroups;
