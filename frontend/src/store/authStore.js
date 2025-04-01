import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      userData: null,
      isLoggedIn: false,
      setupAxiosInterceptors: () => {
        api.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;
            if (
              error.response?.status === 401 &&
              !originalRequest._retry &&
              get().isLoggedIn
            ) {
              originalRequest._retry = true;

              try {
                const response = await axios.post(
                  "/api/v1/auth/refresh",
                  null,
                  {
                    withCredentials: true,
                  }
                );
                const newToken = response.data.data.accessToken;
                // Update the state with the new access token
                set({ accessToken: newToken });
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
              } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                get().clearAuth();
                return Promise.reject(refreshError);
              }
            }
            return Promise.reject(error);
          }
        );
      },

      setAccessToken: (accessToken) =>
        set({ accessToken, isLoggedIn: !!accessToken }),

      clearAuth: () =>
        set({ accessToken: null, userData: null, isLoggedIn: false }),

      fetchUserData: async () => {
        try {
          const response = await api.get("/api/v1/auth", {
            headers: {
              Authorization: `Bearer ${get().accessToken}`,
            },
          });
          set({ userData: response.data });
          return response.data;
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (error.response?.status === 401) {
            get().clearAuth();
          }
          throw error;
        }
      },

      signUp: async (signupData) => {
        try {
          console.log("Signup data being sent:", signupData);
          const response = await api.post("/api/v1/auth", signupData);
          return response.data;
        } catch (error) {
          console.error("Error during signup:", error);
          if (error.response) {
            console.error("Backend response:", error.response.data);
          }
          throw error;
        }
      },

      login: async (loginData) => {
        try {
          console.log("Login data being sent:", loginData);
          const response = await api.post("/api/v1/auth/login", loginData);
          console.log("Login response:", response.data);

          set({
            accessToken: response.data.data.accessToken,
            isLoggedIn: true,
          });
          get().setupAxiosInterceptors();
          console.log("Updated state:", get());
          return response.data;
        } catch (error) {
          console.error("Error during login:", error);
          if (error.response) {
            console.error("Backend response:", error.response.data);
          }
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post("/api/v1/auth/logout", null, {
            headers: {
              Authorization: `Bearer ${get().accessToken}`,
            },
          });
          get().clearAuth();
          console.log("User logged out successfully.");
        } catch (error) {
          console.error("Error during logout:", error);
          get().clearAuth();
          throw error;
        }
      },

      deleteAccount: async () => {
        try {
          await api.delete("/api/v1/auth", {
            headers: {
              Authorization: `Bearer ${get().accessToken}`,
            },
          });
          get().clearAuth();
          console.log("Account deleted successfully.");
        } catch (error) {
          console.error("Error during account deletion:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
        userData: state.userData,
      }),
    }
  )
);

const initStore = () => {
  const state = useAuthStore.getState();
  if (state.isLoggedIn) {
    state.setupAxiosInterceptors();
  }
};

initStore();

export default useAuthStore;
