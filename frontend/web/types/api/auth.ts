import { User } from "../models/user";

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: Pick<User, "id" | "email">;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Pick<User, "id" | "email">;
  access: string;
}

export type MeResponse = User;

export interface RefreshTokenResponse {
  accessToken: string;
}
