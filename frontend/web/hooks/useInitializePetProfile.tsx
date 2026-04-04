import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as profileApi from "@/api/profile";

export function useInitializePetProfile() {
  const { initialized, user } = useAuth();
  const [ownerProfileId, setOwnerProfileId] = useState<string | null>(null);
  const [petProfileId, setPetProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    let isCancelled = false;

    const initialize = async () => {
      try {
        const response = await profileApi.initializePetProfile();
        if (isCancelled) {
          return;
        }

        setPetProfileId(response.id);
        setOwnerProfileId(response.ownerProfileId);
      } catch (err) {
        if (isCancelled) {
          return;
        }
        console.error("Failed to initialize pet profile", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isCancelled = true;
    };
  }, [loading, user, initialized]);

  return { petProfileId, ownerProfileId, loading };
}
