"use client";

import { useEffect, useState } from "react";
import * as profileApi from "@/api/profile";
import { useAuth } from "@/hooks/useAuth";

export default function useOnboarding() {
  const { initialized, user } = useAuth();

  const [isOwnerOnboardingCompleted, setIsOwnerOnboardingCompleted] =
    useState(false);
  const [isPetOnboardingCompleted, setIsPetOnboardingCompleted] =
    useState(false);
  const isOnboardingCompleted = isOwnerOnboardingCompleted || isPetOnboardingCompleted;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    let isCancelled = false;

    const fetchOnboardingStatus = async () => {
      try {
        const res = await profileApi.getOnboardingStatus();
        if (isCancelled) {
          return;
        }

        setIsOwnerOnboardingCompleted(res.ownerProfileCompleted);
        setIsPetOnboardingCompleted(res.petProfileCompleted);
      } catch (err) {
        // TODO: Show error toast
        console.error("Failed to fetch onboarding status", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void fetchOnboardingStatus();

    return () => {
      isCancelled = true;
    };
  }, [initialized, user]);

  return { isOwnerOnboardingCompleted, isPetOnboardingCompleted, isOnboardingCompleted, loading };
}
