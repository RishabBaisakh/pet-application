import axios from "axios";
import { createAPI } from "./axiosFactory";
import {
  AuthResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RefreshTokenResponse,
} from "@/types/api/auth";

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

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const res = await authService.post("/register/", data);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unknown Axios error" };
    }
    throw { detail: "Unexpected error during registration", error: err };
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const res = await authService.post("/login/", data);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unknown Axios error" };
    }
    throw { detail: "Unexpected error during login", error: err };
  }
}

export async function me(): Promise<MeResponse> {
  try {
    const res = await authService.get("/me/");
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unauthorized" };
    }
    throw { detail: "Unexpected error during fetching user data", error: err };
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
    throw { detail: "Unexpected error during logout", error: err };
  }
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse | null> {
  try {
    const res = await authService.post("/token/refresh/");
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        return null;
      }
    }
    throw { detail: "Unexpected error during token refresh", error: err };
  }
}
