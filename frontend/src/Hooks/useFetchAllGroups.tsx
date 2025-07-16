import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllGroups,
  setUnseenMessages,
} from "../../Store/Slices/Group-slice";
import axios from "axios";
import toast from "react-hot-toast";
import type { RootState } from "../../Store/store";
import { api } from "../../Api/axios";

const useFetchAllGroups = () => {
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await api.get("/api/v1/groups/my", {
          withCredentials: true,
        });

        if (response.data.success) {
          dispatch(setAllGroups(response.data.allGroups));
          dispatch(setUnseenMessages(response.data.unseenMessages));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    if (loggedInUser) {
      fetchAllGroups();
    }
  }, [loggedInUser, dispatch]);
};

export default useFetchAllGroups;
