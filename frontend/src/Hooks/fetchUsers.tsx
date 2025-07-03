import { useEffect } from "react";
import { api } from "../../Api/axios";
import {
  setAllUsers,
  setUnseenMessages,
} from "../../Store/Slices/message-slice";
import axios from "axios";
import { useDispatch } from "react-redux";

export const useFetchUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await api.get("/api/v1/user/get-users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setAllUsers(response?.data?.users || null));
          dispatch(setUnseenMessages(response.data.unseenMessages));
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

    fetchAllUsers();
  }, [dispatch]);
};
