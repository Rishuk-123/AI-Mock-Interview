import { create } from "zustand";
import api from "../services/api";
import useInterviewStore from "./useInterviewStore";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  initialized: false,

  register: async (data) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/register", data);

      set({ loading: false });

      return res.data;
    } catch (err) {
      set({ loading: false });

      throw err.response?.data || {
        message: "Registration failed",
      };
    }
  },

  login: async (data) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);

      // Clear any previous user's cached store state
      if (typeof useInterviewStore.getState().reset === "function") {
        useInterviewStore.getState().reset();
      } else {
        useInterviewStore.setState({ interviews: [], currentInterview: null });
      }

      set({
        token: res.data.token,
        user: res.data.user,
        loading: false,
        initialized: true,
      });

      return res.data;
    } catch (err) {
      set({ loading: false });

      throw err.response?.data || {
        message: "Login failed",
      };
    }
  },

  fetchProfile: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({
        user: null,
        token: null,
        initialized: true,
      });

      return;
    }

    try {
      const res = await api.get("/users/profile");

      set({
        user: res.data.user,
        token,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        initialized: true,
      });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });

    try {
      const res = await api.put("/users/profile", data);

      set((state) => ({
        user: res.data.user || { ...state.user, ...data },
        loading: false,
      }));

      return res.data;
    } catch (err) {
      set({ loading: false });

      throw err.response?.data || {
        message: "Failed to update profile",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    // Clear active interview state from store memory
    if (typeof useInterviewStore.getState().reset === "function") {
      useInterviewStore.getState().reset();
    } else {
      useInterviewStore.setState({ interviews: [], currentInterview: null });
    }

    set({
      token: null,
      user: null,
      initialized: true,
      loading: false,
    });
  },
}));

export default useAuthStore;