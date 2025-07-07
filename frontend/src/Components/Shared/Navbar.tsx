import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiChat1, CiUser, CiHome, CiLogout } from "react-icons/ci";
import {
  setLoggedInUser,
  setOnlineUsers,
} from "../../../Store/Slices/auth-slice";
import {
  setAllUsers,
  setSelectedUserMsgs,
  setUnseenMessages,
  setUserSelected,
} from "../../../Store/Slices/message-slice";
import { useContext } from "react";
import { socketContext } from "../../../ContextForSocket/context";
import type { RootState } from "../../../Store/store";
import axios from "axios";
import { api } from "../../../Api/axios";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SocketContext = useContext(socketContext);
  const { userSelected } = useSelector((state: RootState) => state.message);

  const logoutHandler = async () => {
    try {
      const response = await api.get("api/v1/auth/logout", {
        withCredentials: true,
      });
      if (response?.data?.success) {
        localStorage.removeItem("accessToken");
        dispatch(setLoggedInUser(null));
        dispatch(setAllUsers(null));
        dispatch(setOnlineUsers([]));
        dispatch(setUserSelected(null));
        dispatch(setUnseenMessages({}));
        dispatch(setSelectedUserMsgs(null));
        SocketContext?.socket?.disconnect();
        navigate("/login");
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        navigate("login");
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <header
      className={` ${
        userSelected && "max-sm:hidden"
      } sm:min-w-20 max-sm:w-screen sm:h-screen max-sm:pb-2`}
    >
      <div className="flex sm:flex-col gap-4 px-2 pt-2 sm:h-full max-sm:w-screen max-sm:justify-between">
        <div className="flex gap-2 justify-center ">
          <img
            src="../../../public/favicon.svg"
            alt="Logo"
            width="40"
            height="20"
          />
          <p className="sm:hidden my-auto">QuickChat</p>
        </div>
        <nav className="flex sm:flex-col justify-between h-full">
          <ul className="flex sm:flex-col max-sm:gap-5 sm:gap-10 p-2 cursor-pointer font-medium items-center">
            <li>
              <CiHome
                className="size-6 hover:scale-105 duration-300 "
                onClick={() => {
                  dispatch(setUserSelected(null));
                  navigate("/");
                }}
              />
            </li>
            <li>
              <CiUser
                className="size-6 hover:scale-105 duration-300 "
                onClick={() => navigate("/profile")}
              />
            </li>
            <li className="sm:hidden">
              <CiLogout
                className="size-6 hover:scale-105 duration-300 "
                onClick={logoutHandler}
              />
            </li>
          </ul>
          <div className="flex flex-col mb-4 items-center max-sm:hidden">
            <CiLogout
              className="size-6  hover:scale-105 duration-300 "
              onClick={logoutHandler}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
