import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { setUnseenMessages, setUserSelected } from "./message-slice";
import type { Message, UnseenMessages } from "../../types/models";

export interface Group {
  _id: string;
  name: string;
  admin: string;
  members: string[];
  messages: string[];
}

interface state {
  groups: Group[];
  groupSelected: Group | null;
  selectedGroupMessages: Message[];
  unseenMessages: UnseenMessages;
}

const initialState: state = {
  groups: [],
  groupSelected: null,
  selectedGroupMessages: [],
  unseenMessages: {},
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setAllGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setGroupSelected: (state, action: PayloadAction<Group | null>) => {
      state.groupSelected = action.payload;
    },
    setSelectedGroupMessages: (state, action: PayloadAction<Message[]>) => {
      state.selectedGroupMessages = action.payload;
    },
    // setUnseenMessages: (state, action: PayloadAction<Message[]>) => {
    //   state.selectedGroupMessages = action.payload;
    // },
  },
});

export const { setAllGroups, setGroupSelected, setSelectedGroupMessages } =
  groupSlice.actions;

export default groupSlice.reducer;
