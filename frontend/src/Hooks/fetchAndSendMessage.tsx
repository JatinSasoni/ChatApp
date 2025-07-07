import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { api } from "../../Api/axios";
import { setSelectedUserMsgs } from "../../Store/Slices/message-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLoggedInUser } from "../../Store/Slices/auth-slice";

export const useFetchAndSend = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );

  //*Fetching user messages and images
  const fetchUserMessagesHandler = async (selectedUserId: string) => {
    try {
      const response = await api.get(`/api/v1/message/${selectedUserId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setSelectedUserMsgs(response?.data?.selectedUserMessages));
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
      dispatch(setLoggedInUser(null));
      navigate("/login");
    }
  };

  //*sendMessageHandler
  const sendMessage = async (
    input: string,
    selectedUserId: string | undefined,
    image?: string | ArrayBuffer | null
  ) => {
    if (!input && !image) return;
    try {
      const response = await api.post(
        `api/v1/message/send/${selectedUserId}`,
        { text: input, image: image },
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        dispatch(
          setSelectedUserMsgs([
            ...(selectedUserMessages || []), //COZ TYPE OF selectedUserMessages could be of null type
            response.data.newMessage,
          ])
        );
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
      dispatch(setLoggedInUser(null));
      navigate("/login");
    }
  };

  return { sendMessage, fetchUserMessagesHandler };
};
