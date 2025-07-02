import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { user } from "../../types/models";

export interface authState {
  loggedInUser: user | null;
}

const initialState: authState = {
  loggedInUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<user | null>) => {
      state.loggedInUser = action.payload;
    },
  },
});

export const { setLoggedInUser } = authSlice.actions;
export default authSlice.reducer;
