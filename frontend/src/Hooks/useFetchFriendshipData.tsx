import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setFriends,
  setRequestReceived,
  setRequestSent,
} from "../../Store/Slices/friends-slice";
import { api } from "../../Api/axios";
import axios from "axios";
import toast from "react-hot-toast";

const useFetchFriendshipData = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/friendship/get/requests", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setFriends(res.data.totalFriends));
        dispatch(setRequestReceived(res.data.requestReceived));
        dispatch(setRequestSent(res.data.requestSent));
      }

      //store
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch requests");
      } else {
        console.log(err);
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };
  return { fetchRequests, loading, setLoading };
};

export default useFetchFriendshipData;
