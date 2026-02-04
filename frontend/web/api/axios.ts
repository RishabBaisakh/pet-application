// api/axios.ts
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth`;

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies (refresh token)
});
