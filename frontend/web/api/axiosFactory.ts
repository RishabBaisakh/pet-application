import axios from "axios";

type Service = "auth" | "profile";

const API_BASES: Record<Service, string> = {
  auth: `${process.env.NEXT_PUBLIC_API_HOST_AUTH}/api/auth`,
  profile: `${process.env.NEXT_PUBLIC_API_HOST_PROFILE}/api/profile`,
};

export const createAPI = (service: Service) => {
  return axios.create({
    baseURL: API_BASES[service],
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // send cookies (refresh token)
  });
};
