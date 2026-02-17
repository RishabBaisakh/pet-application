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
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login({ email, password });
      setAccessToken(data.access);
      setUser(data.user);
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      console.error("Login failed", err);
      throw new Error(error?.response?.data?.detail || "Login failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      await api.register({ email, password, confirmPassword });
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      console.error("Registration failed", err);
      throw new Error(error?.response?.data?.detail || "Registration failed");
    }
  };

  const logout = async () => {
    if (!accessToken) return;
    try {
      // call backend to blacklist refresh token
      await api.logout("/logout", accessToken);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.refreshAccessToken();
        if (data && data.accessToken) {
          setAccessToken(data.accessToken);

          const res = await api.me(data.accessToken);
          setUser(res);
        } else {
          setUser(null);
          console.warn("No access token found during initialization");
        }
      } catch (err) {
        setUser(null);
        console.error("Failed to initialize auth context", err);
      } finally {
        setInitialized(true);
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        initialized,
        login,
        logout,
        register,
      }}>
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
