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

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SocketContext = useContext(socketContext);

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    dispatch(setLoggedInUser(null));
    dispatch(setAllUsers(null));
    dispatch(setOnlineUsers([]));
    dispatch(setUserSelected(null));
    dispatch(setUnseenMessages({}));
    dispatch(setSelectedUserMsgs(null));
    SocketContext?.socket?.disconnect();
    navigate("/login");
  };

  return (
    <header className="min-w-20 h-screen">
      <div className="flex flex-col gap-4  px-2 pt-2 h-full">
        <div className="flex gap-2 justify-center ">
          <img
            src="../../../public/favicon.svg"
            alt="Logo"
            width="40"
            height="20"
          />
        </div>
        <nav className="flex flex-col justify-between h-full">
          <ul className="flex flex-col gap-10 p-2 cursor-pointer font-medium items-center">
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
          </ul>
          <div className="flex flex-col mb-4 items-center">
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
