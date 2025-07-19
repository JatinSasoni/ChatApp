import { useEffect } from "react";
import { api } from "../../Api/axios";
import {
  setAllUsers,
  setUnseenMessages,
} from "../../Store/Slices/message-slice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { RootState } from "../../Store/store";
import { setFriends } from "../../Store/Slices/friends-slice";

export const useFetchUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state: RootState) => state.auth);

  //FETCHING USERS AND FRIENDS IN PARALLEL
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const [userRes, FriendRes] = await Promise.all([
          api.get("/api/v1/user/get-users", {
            withCredentials: true,
          }),
          api.get("/api/v1/friendship/get/friends", {
            withCredentials: true,
          }),
        ]);

        //* Handle users + unseen messages
        if (userRes.data?.success) {
          dispatch(setAllUsers(userRes.data.users || []));
          dispatch(setUnseenMessages(userRes.data.unseenMessages || {}));
        }

        //* Handle friends
        if (FriendRes.data?.success) {
          dispatch(setFriends(FriendRes.data.friendList || []));
        }
      } catch (error) {
        //*Type guard
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    };

    if (loggedInUser) {
      fetchAllUsers();
      // fetchFriends();
    }
  }, [dispatch, navigate, loggedInUser]);
};
