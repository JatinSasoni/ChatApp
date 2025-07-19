import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { api } from "../../Api/axios";
import { setSelectedUserMsgs } from "../../Store/Slices/message-slice";
import axios from "axios";
import { useCallback, useState } from "react";
import { setSelectedGroupMessages } from "../../Store/Slices/Group-slice";
import toast from "react-hot-toast";

export const useFetchAndSend = () => {
  const dispatch = useDispatch();
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [groupMessageLoading, setGroupMessageLoading] =
    useState<boolean>(false);

  const { selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );

  const { selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );

  //* Fetching user messages and images
  const fetchUserMessagesHandler = useCallback(
    async (selectedUserId: string) => {
      try {
        setMessageLoading(true);
        const response = await api.get(`/api/v1/message/${selectedUserId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setSelectedUserMsgs(response?.data?.selectedUserMessages));
        }
      } catch (error) {
        //*Type guard
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setMessageLoading(false);
      }
    },
    [dispatch]
  );

  //*sendMessageHandler for one-to-one chat
  const sendMessage = useCallback(
    async (
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
          toast.error(error.response?.data.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
    [dispatch, selectedUserMessages]
  );

  //* Fetching group messages and images
  const fetchGroupMessages = async (groupId: string | undefined) => {
    try {
      setGroupMessageLoading(true);
      const response = await api.get(
        `/api/v1/groups/messages/group/${groupId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setSelectedGroupMessages(response?.data?.messages));
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
      // dispatch(setLoggedInUser(null));
      // navigate("/login");
    } finally {
      setGroupMessageLoading(false);
    }
  };

  //*sendMessageHandler for group-chat
  const sendMessageGroup = useCallback(
    async (
      input: string,
      selectedGroupId: string | undefined,
      image?: string | ArrayBuffer | null
    ) => {
      if (!input && !image) return;
      try {
        const response = await api.post(
          `/api/v1/groups/messages/send/group/${selectedGroupId}`,
          { message: input, image: image },
          {
            withCredentials: true,
          }
        );

        if (response?.data?.success) {
          dispatch(
            setSelectedGroupMessages([
              ...(selectedGroupMessages || []), // COZ TYPE OF selectedGroupMessages could be of null type
              response.data.newMessage,
            ])
          );
        }
      } catch (error) {
        //*Type guard
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
    [dispatch, selectedGroupMessages]
  );

  return {
    sendMessage,
    fetchUserMessagesHandler,
    messageLoading,
    groupMessageLoading,
    fetchGroupMessages,
    sendMessageGroup,
  };
};
