// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload;
      if (token) {
        localStorage.setItem("token", token);
      }
      return {
        ...state,
        user: user ? { ...user } : null,
        token: token || null,
        isLoading: false,
      };
    },
    removeUser(state) {
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
      };
    },
    updateToken(state, action) {
      const newToken = action.payload;
      localStorage.setItem("token", newToken);
      return {
        ...state,
        token: newToken,
      };
    },
    setLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
});

export const { setUser, removeUser, updateToken, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
