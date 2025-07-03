import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLoggedInUser,
  setOnlineUsers,
} from "../../../Store/Slices/auth-slice";
import { setAllUsers } from "../../../Store/Slices/message-slice";
import { useContext } from "react";
import { socketContext } from "../../../ContextForSocket/context";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SocketContext = useContext(socketContext);

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    dispatch(setLoggedInUser(null));
    dispatch(setAllUsers(null));
    dispatch(setOnlineUsers([]));
    SocketContext?.socket?.disconnect();
    navigate("/login");
  };

  return (
    <header className="my-2 text-white p-2">
      <div className="flex justify-around items-center">
        <div className="flex gap-2 items-center">
          <img
            src="../../../public/favicon.svg"
            alt="Logo"
            width="40"
            height="20"
          />
          <p className="font-semibold">QuickChat</p>
        </div>
        <nav>
          <ul className="flex gap-8 p-2 cursor-pointer font-medium">
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={logoutHandler}>Logout</li>
            <li onClick={() => navigate("/login")}>Login</li>
            <li onClick={() => navigate("/signup")}>Signup</li>
            <li onClick={() => navigate("/Profile")}>Profile</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
