"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import * as authApi from "@/api/auth";
import * as profileApi from "@/api/profile";
import { configureProfileClient } from "@/api/profile";
import { configureMediaClient } from "@/api/media";
import { User as BaseUser } from "@/types/models/user";

interface User extends Pick<BaseUser, "id" | "email"> {
  ownerProfileCompleted: boolean;
  petProfileCompleted: boolean;
  profileStatusUnknown: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  initialized: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    ownerProfileCompleted: boolean;
    petProfileCompleted: boolean;
    profileStatusUnknown: boolean;
  }>;
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
  const accessTokenRef = useRef<string | null>(null);

  const clearAuthState = useCallback(async () => {
    accessTokenRef.current = null;
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    authApi.configureAuthClient({
      getAccessToken: () => accessTokenRef.current,
      logout: clearAuthState,
    });

    configureProfileClient({
      getAccessToken: () => accessTokenRef.current,
      logout: clearAuthState,
    });

    configureMediaClient({
      getAccessToken: () => accessTokenRef.current,
      logout: clearAuthState,
    });
  }, [clearAuthState]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      accessTokenRef.current = data.access;
      setAccessToken(data.access);

      let ownerProfileCompleted = false;
      let petProfileCompleted = false;
      let profileStatusUnknown = false;

      try {
        const status = await profileApi.getOnboardingStatus();
        ownerProfileCompleted = status.ownerProfileCompleted;
        petProfileCompleted = status.petProfileCompleted;
      } catch {
        profileStatusUnknown = true;
      }

      setUser({
        ...data.user,
        ownerProfileCompleted,
        petProfileCompleted,
        profileStatusUnknown,
      });

      return { ownerProfileCompleted, petProfileCompleted, profileStatusUnknown };
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
      await authApi.register({ email, password, confirmPassword });
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      console.error("Registration failed", err);
      throw new Error(error?.response?.data?.detail || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      if (accessTokenRef.current) {
        await authApi.logout();
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      await clearAuthState();
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = await authApi.refreshAccessToken();
        const refreshedAccessToken = data?.accessToken;

        if (refreshedAccessToken) {
          accessTokenRef.current = refreshedAccessToken;
          setAccessToken(refreshedAccessToken);

          const res = await authApi.me();

          let ownerProfileCompleted = false;
          let petProfileCompleted = false;
          let profileStatusUnknown = false;

          try {
            const status = await profileApi.getOnboardingStatus();
            ownerProfileCompleted = status.ownerProfileCompleted;
            petProfileCompleted = status.petProfileCompleted;
          } catch {
            profileStatusUnknown = true;
          }

          setUser({
            id: res.id,
            email: res.email,
            ownerProfileCompleted,
            petProfileCompleted,
            profileStatusUnknown,
          });
        } else {
          await clearAuthState();
          console.warn("No access token found during initialization");
        }
      } catch (err) {
        await clearAuthState();
        console.error("Failed to initialize auth context", err);
      } finally {
        setInitialized(true);
      }
    };
    init();
  }, [clearAuthState]);

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
