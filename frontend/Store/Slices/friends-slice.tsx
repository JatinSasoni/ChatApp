import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type user } from "../../types/models.js";

interface state {
  friends: user[];
}

const initialState: state = {
  friends: [],
};
const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<user[]>) => {
      state.friends = action.payload;
    },
  },
});

export const { setFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
