import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as profileApi from "@/api/profile";

export function useInitializeOwnerProfile() {
  const { initialized, user } = useAuth();
  const [ownerProfileId, setOwnerProfileId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    let isCancelled = false;

    const initialize = async () => {
      try {
        setIsInitializing(true);

        const response = await profileApi.initializeOwnerProfile();
        if (isCancelled) {
          return;
        }

        setOwnerProfileId(response.id);
      } catch (err) {
        if (isCancelled) {
          return;
        }
        console.error("Failed to initialize owner profile", err);
      } finally {
        if (!isCancelled) {
          setIsInitializing(false);
        }
      }
    };

    initialize();

    return () => {
      isCancelled = true;
    };
  }, [initialized, user]);

  return { ownerProfileId, isInitializing };
}
