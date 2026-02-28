import axios from "axios";
import { createAPI } from "./axiosFactory";

interface AuthClientRuntime {
  getAccessToken: () => string | null;
  logout: () => Promise<void>;
}

const authClientRuntime: AuthClientRuntime = {
  getAccessToken: () => null,
  logout: async () => undefined,
};

export function configureAuthClient(options: Partial<AuthClientRuntime>) {
  if (options.getAccessToken) {
    authClientRuntime.getAccessToken = options.getAccessToken;
  }
  if (options.logout) {
    authClientRuntime.logout = options.logout;
  }
}

const authService = createAPI("auth", {
  getAccessToken: () => authClientRuntime.getAccessToken(),
  logout: () => authClientRuntime.logout(),
});

export async function register(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const res = await authService.post("/register/", data);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unknown Axios error" };
    }
    throw { detail: "Unexpected error" };
  }
}

export async function login(data: { email: string; password: string }) {
  try {
    const res = await authService.post("/login/", data);
    return res.data; // { user, access }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unknown Axios error" };
    }
    throw { detail: "Unexpected error" };
  }
}

export async function me() {
  try {
    const res = await authService.get("/me/");
    return res.data; // user object
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unauthorized" };
    }
    throw { detail: "Unexpected error" };
  }
}

export async function logout() {
  try {
    const res = await authService.post("/logout/");
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Logout failed" };
    }
    throw { detail: "Unexpected error" };
  }
}

export async function refreshAccessToken() {
  try {
    const res = await authService.post("/token/refresh/");
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        return null;
      }
    }
    throw { detail: "Unexpected error" };
  }
}
