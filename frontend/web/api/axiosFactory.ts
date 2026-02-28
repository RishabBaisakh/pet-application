// lib/api.ts
import axios, { AxiosInstance } from "axios";

type Service = "auth" | "profile";

const API_BASES: Record<Service, string> = {
  auth: `${process.env.NEXT_PUBLIC_API_HOST_AUTH}/api/auth`,
  profile: `${process.env.NEXT_PUBLIC_API_HOST_PROFILE}/api/profile`,
};

interface APIOptions {
  getAccessToken: () => string | null;
  logout: () => Promise<void>;
}

export const createAPI = (
  service: Service,
  options: APIOptions,
): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASES[service],
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // send httpOnly refresh token cookie
  });

  const { getAccessToken, logout } = options;

  // Request interceptor
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status;

      const shouldLogout = [401, 419, 440, 498];

      if (shouldLogout.includes(status)) {
        await logout();
      }

      return Promise.reject(error);
    },
  );

  return api;
};
