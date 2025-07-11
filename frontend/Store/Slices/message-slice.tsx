import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message, UnseenMessages, user } from "../../types/models";

interface messageState {
  allUsers: user[] | null;
  userSelected: user | null;
  selectedUserMessages: Message[] | null;
  unseenMessages: UnseenMessages;
  friends: user[] | null;
}

const initialState: messageState = {
  allUsers: null,
  userSelected: null,
  selectedUserMessages: null,
  unseenMessages: {},
  friends: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setAllUsers: (state, action: PayloadAction<user[] | null>) => {
      state.allUsers = action.payload;
    },
    setUserSelected: (state, action: PayloadAction<user | null>) => {
      state.userSelected = action.payload;
    },
    setSelectedUserMsgs: (state, action: PayloadAction<Message[] | null>) => {
      state.selectedUserMessages = action.payload;
    },
    setUnseenMessages: (state, action: PayloadAction<UnseenMessages>) => {
      state.unseenMessages = action.payload;
    },
    setFriends: (state, action: PayloadAction<user[] | null>) => {
      state.friends = action.payload;
    },
  },
});

export const {
  setAllUsers,
  setUserSelected,
  setSelectedUserMsgs,
  setUnseenMessages,
  setFriends,
} = messageSlice.actions;
export default messageSlice.reducer;
