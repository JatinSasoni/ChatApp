import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message, UnseenMessages, user } from "../../types/models";

interface messageState {
  allUsers: user[] | null;
  userSelected: user | null;
  selectedUserMessages: Message[];
  unseenMessages: UnseenMessages;
  nextCursor: string | null;
  hasMore: boolean;
}

const initialState: messageState = {
  allUsers: null,
  userSelected: null,
  selectedUserMessages: [],
  unseenMessages: {},
  nextCursor: null,
  hasMore: false,
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
    setSelectedUserMsgs: (state, action: PayloadAction<Message[]>) => {
      state.selectedUserMessages = action.payload;
    },
    setUnseenMessages: (state, action: PayloadAction<UnseenMessages>) => {
      state.unseenMessages = action.payload;
    },
    setCursor: (state, action: PayloadAction<string | null>) => {
      state.nextCursor = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    prependMessages: (state, action: PayloadAction<Message[]>) => {
      state.selectedUserMessages = [
        ...action.payload,
        ...state.selectedUserMessages,
      ];
    },
    appendMessages: (state, action: PayloadAction<Message>) => {
      state.selectedUserMessages = [
        ...state.selectedUserMessages,
        action.payload,
      ];
    },
    resetConversation: (state) => {
      state.selectedUserMessages = [];
      state.nextCursor = null;
      state.hasMore = true;
    },
  },
});

export const {
  setAllUsers,
  setUserSelected,
  setSelectedUserMsgs,
  prependMessages,
  appendMessages,
  setCursor,
  setHasMore,
  setUnseenMessages,
  resetConversation,
} = messageSlice.actions;
export default messageSlice.reducer;
