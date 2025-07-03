import Sidebar from "./Sidebar";
import MessagesContainer from "./MessagesContainer";
import RightSidebar from "./RightSidebar";
import Navbar from "./Shared/Navbar";
import { useContext, useEffect } from "react";
import { api } from "../../Api/axios";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoggedInUser,
  setOnlineUsers,
  setSocketId,
} from "../../Store/Slices/auth-slice";
import { connectToSocket } from "../../Utils/createSocketConnection";
import type { RootState } from "../../Store/store";
import { socketContext } from "../../ContextForSocket/context";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const { userSelected } = useSelector((state: RootState) => state.message);
  const SocketContext = useContext(socketContext);

  const checkAuth = async () => {
    try {
      const response = await api.get("/api/v1/auth/check", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        //*If Authentication successful Update store
        dispatch(setLoggedInUser(response.data.user));
        const newSocket = connectToSocket(response.data.user) || null;
        if (newSocket) {
          dispatch(setSocketId(newSocket?.id || null));
          newSocket?.on("getOnlineUsers", (userIds: string[]) => {
            dispatch(setOnlineUsers(userIds));
          });
          SocketContext?.setSocket(newSocket || null);
          newSocket?.on("getOnlineUsers", (userIds: string[]) => {
            dispatch(setOnlineUsers(userIds));
          });
        }
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

  useEffect(() => {
    if (!loggedInUser) {
      checkAuth();
    }
  }, [loggedInUser]);

  return (
    <section>
      <Navbar />
      <main>
        <div
          className={`mx-auto max-w-7xl my-3 h-[600px] max-h-[800px] grid ${
            userSelected ? "grid-cols-4 gap-3" : "grid-cols-2"
          }`}
        >
          <Sidebar />
          <MessagesContainer />
          <RightSidebar />
        </div>
      </main>
    </section>
  );
};

export default Home;
