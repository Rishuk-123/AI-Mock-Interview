import { create } from "zustand";
import api from "../services/api";
import useInterviewStore from "./useInterviewStore";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  initialized: false,

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/register", data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Default to 100 credits if not provided
      const userPayload = res.data.user
        ? { ...res.data.user, credits: res.data.user.credits ?? 100 }
        : null;

      set({
        token: res.data.token || null,
        user: userPayload,
        loading: false,
        initialized: true,
      });

      return res.data;
    } catch (err) {
      set({ loading: false });
      throw err.response?.data || { message: "Registration failed" };
    }
  },

  login: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);

      if (typeof useInterviewStore.getState().reset === "function") {
        useInterviewStore.getState().reset();
      } else {
        useInterviewStore.setState({
          interviews: [],
          currentInterview: null,
        });
      }

      // Default to 100 credits if not provided
      const userPayload = res.data.user
        ? { ...res.data.user, credits: res.data.user.credits ?? 100 }
        : null;

      set({
        token: res.data.token,
        user: userPayload,
        loading: false,
        initialized: true,
      });

      return res.data;
    } catch (err) {
      set({ loading: false });
      throw err.response?.data || { message: "Login failed" };
    }
  },

  fetchProfile: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, token: null, initialized: true });
      return;
    }

    try {
      const res = await api.get("/users/profile");
      const userPayload = res.data.user
        ? { ...res.data.user, credits: res.data.user.credits ?? 100 }
        : null;

      set({
        user: userPayload,
        token,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null, initialized: true });
    }
  },

  // Deduct 30 credits per interview
  deductCredit: (amount = 30) => {
    set((state) => {
      if (!state.user) return state;

      const currentCredits = typeof state.user.credits === "number" ? state.user.credits : 100;
      const updatedCredits = Math.max(0, currentCredits - amount);

      return {
        user: {
          ...state.user,
          credits: updatedCredits,
        },
      };
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    if (typeof useInterviewStore.getState().reset === "function") {
      useInterviewStore.getState().reset();
    } else {
      useInterviewStore.setState({
        interviews: [],
        currentInterview: null,
      });
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