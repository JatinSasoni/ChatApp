import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type user } from "../../types/models.js";

export interface Group {
  _id: string;
  name: string;
  admin: string;
  members: string[];
  messages: string[];
}

interface state {
  groups: Group;
}

const initialState: state = {
  groups: [],
};
const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<user[]>) => {
      state.friends = action.payload;
    },
    setRequestSent: (state, action: PayloadAction<user[]>) => {
      state.requestSent = action.payload;
    },
    setRequestReceived: (state, action: PayloadAction<user[]>) => {
      state.requestReceived = action.payload;
    },
  },
});

export const { setFriends, setRequestSent, setRequestReceived } =
  friendsSlice.actions;
export default friendsSlice.reducer;
