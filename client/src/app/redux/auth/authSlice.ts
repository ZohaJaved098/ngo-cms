import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  email: string;
  role: string;
  token: string;
}

const guestUser: User = {
  username: "Guest",
  email: "",
  role: "guest",
  token: "",
};

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  user: guestUser,
  isAuthenticated: false,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = guestUser;
      state.isAuthenticated = false;
      state.registerSuccess = false;
    },
    registerSuccess: (state) => {
      state.registerSuccess = true;
    },
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
  },
});

export const { loginSuccess, logout, registerSuccess, resetRegisterSuccess } =
  authSlice.actions;

export default authSlice.reducer;
