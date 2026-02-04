import { axiosInstance } from "./axios";
import axios from "axios";

export async function register(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const res = await axiosInstance.post("/register/", data);
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
    const res = await axiosInstance.post("/login/", data);
    return res.data; // { user, access }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unknown Axios error" };
    }
    throw { detail: "Unexpected error" };
  }
}

export async function me(accessToken: string) {
  try {
    const res = await axiosInstance.get("/me/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data; // user object
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Unauthorized" };
    }
    throw { detail: "Unexpected error" };
  }
}

export async function logout(refreshToken: string, accessToken: string) {
  try {
    const res = await axiosInstance.post(
      "/logout/",
      { refresh: refreshToken },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
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
    const res = await axiosInstance.post("/token/refresh/");
    return res.data; // { access: "newAccessToken" }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || { detail: "Token refresh failed" };
    }
    throw { detail: "Unexpected error" };
  }
}
