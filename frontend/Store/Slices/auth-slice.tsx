import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { user } from "../../types/models";
// import type { Socket } from "socket.io-client";

export interface authState {
  loggedInUser: user | null;
  onlineUsers: string[];
  socket: string | null;
}

const initialState: authState = {
  loggedInUser: null,
  onlineUsers: [],
  socket: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<user | null>) => {
      state.loggedInUser = action.payload;
    },
    setSocketId: (state, action: PayloadAction<string | null>) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setLoggedInUser, setSocketId, setOnlineUsers } =
  authSlice.actions;
export default authSlice.reducer;
