"use client";

import { useState, useEffect, createContext, useContext } from "react";
import * as api from "@/api/auth";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Login
  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setAccessToken(data.access);
    setUser(data.user);
  };

  // Logout
  const logout = async () => {
    if (!accessToken) return;
    try {
      // call backend to blacklist refresh token
      await api.logout("", accessToken); // refresh token in cookie
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      // call your refresh endpoint, backend reads httpOnly cookie
      const res = await api.refreshAccessToken?.(); // implement in api
      setAccessToken(res.access);
    } catch (err) {
      console.error("Token refresh failed", err);
      setUser(null);
      setAccessToken(null);
    }
  };

  // Optional: fetch current user on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.me(accessToken!);
        setUser(res);
      } catch {
        setUser(null);
      }
    };
    if (accessToken) init();
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
