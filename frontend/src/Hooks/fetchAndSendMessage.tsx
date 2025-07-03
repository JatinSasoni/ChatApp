import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { api } from "../../Api/axios";
import { setSelectedUserMsgs } from "../../Store/Slices/message-slice";
import axios from "axios";

export const useFetchAndSend = () => {
  const dispatch = useDispatch();
  const { selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );

  //*Fetching user messages
  const fetchUserMessagesHandler = async (selectedUserId: string) => {
    try {
      const response = await api.get(`/api/v1/message/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        dispatch(setSelectedUserMsgs(response?.data.selectedUserMessages));
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

  //*sendMessageHandler
  const sendMessage = async (
    input: string,
    selectedUserId: string | undefined
  ) => {
    try {
      const response = await api.post(
        `api/v1/message/send/${selectedUserId}`,
        { text: input, image: "" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
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
    }
  };

  return { sendMessage, fetchUserMessagesHandler };
};
