import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CiUser, CiHome, CiLogout } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { IoAdd } from "react-icons/io5";

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
import { useContext, useState } from "react";
import { socketContext } from "../../../ContextForSocket/context";
import type { RootState } from "../../../Store/store";
import axios from "axios";
import { api } from "../../../Api/axios";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);
  const SocketContext = useContext(socketContext);
  const { userSelected } = useSelector((state: RootState) => state.message);
  const { groupSelected } = useSelector((state: RootState) => state.group);

  const logoutHandler = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/auth/logout", {
        // remove refresh token
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
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      className={`flex ${
        ((userSelected && location.pathname === "/") ||
          (groupSelected && location.pathname === "/groups")) &&
        "max-lg:hidden"
      }
      } px-2 max-sm:w-screen sm:h-screen max-sm:pb-2 `}
    >
      <div className="flex sm:flex-col gap-4 px-2 pt-2 sm:h-full max-sm:w-screen max-sm:justify-between">
        <div className="flex gap-2 justify-center ">
          <img src="/favicon.svg" alt="Logo" width="40" height="20" />
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
            <li>
              <GoPeople
                className="size-5 hover:scale-105 duration-300 "
                onClick={() => navigate("/groups")}
              />
            </li>
            <li>
              <IoAdd
                className="size-6 hover:scale-105 duration-300 "
                onClick={() => navigate("/groups/create")}
              />
            </li>

            <li className="sm:hidden">
              {loading ? (
                <div className="border-t-2 border-b-2 rounded-full p-2 animate-spin"></div>
              ) : (
                <CiLogout
                  className={`size-6  hover:scale-105 duration-300 `}
                  onClick={logoutHandler}
                />
              )}
            </li>
          </ul>
          <div className="flex flex-col mb-4 items-center max-sm:hidden">
            {loading ? (
              <div className="border-t-2 border-b-2 rounded-full p-2 animate-spin"></div>
            ) : (
              <CiLogout
                className={`size-6  hover:scale-105 duration-300 `}
                onClick={logoutHandler}
              />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
