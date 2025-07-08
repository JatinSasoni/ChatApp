import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { api } from "../../Api/axios";
import {
  setLoggedInUser,
  setOnlineUsers,
  setSocketId,
} from "../../Store/Slices/auth-slice";
import { connectToSocket } from "../../Utils/createSocketConnection";
import { socketContext } from "../../ContextForSocket/context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useCheckAuth = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const SocketContext = useContext(socketContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/v1/auth/check", {
          withCredentials: true,
        });

        if (response?.data?.success) {
          //*If Authentication successful Update store
          dispatch(setLoggedInUser(response.data.user));

          if (!SocketContext?.socket) {
            const newSocket = connectToSocket(response.data.user) || null;
            if (newSocket) {
              dispatch(setSocketId(newSocket?.id || null));

              newSocket?.on("getOnlineUsers", (userIds: string[]) => {
                dispatch(setOnlineUsers(userIds));
              });
              SocketContext?.setSocket(newSocket || null);
            }
          }
        }
      } catch (error) {
        //*Type guard
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        } else {
          console.log("An unexpected error occurred:", error);
        }
        window.location.href = "/login";
      }
    };

    if (!loggedInUser) {
      checkAuth();
    }
  }, [loggedInUser, SocketContext, dispatch, navigate]);
};
