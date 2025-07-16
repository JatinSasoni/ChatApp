import { useState } from "react";
import { api } from "../../Api/axios";
import axios from "axios";
import toast from "react-hot-toast";

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendRequestHandler = async (receiverId: string | undefined) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/api/v1/friendship/send/${receiverId}/request`,
        "",
        {
          withCredentials: true,
        }
      );
      if (response?.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return { loading, sendRequestHandler };
};

export default useSendFriendRequest;
