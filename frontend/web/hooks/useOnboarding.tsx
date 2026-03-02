"use client";

import { useEffect, useState } from "react";
import * as onboardingAPI from "@/api/onboarding";
import { useAuth } from "@/hooks/useAuth";

export default function useOnboarding() {
  const { initialized, user, accessToken } = useAuth();

  const [isOwnerOnboardingCompleted, setIsOwnerOnboardingCompleted] =
    useState(false);
  const [isPetOnboardingCompleted, setIsPetOnboardingCompleted] =
    useState(false);

  useEffect(() => {
    if (!initialized || !user || !accessToken) {
      return;
    }

    let isCancelled = false;

    const fetchOnboardingStatus = async () => {
      try {
        const res = await onboardingAPI.getOnboardingStatus();
        console.log("🚀 ~ fetchOnboardingStatus ~ res:", res);
        if (isCancelled) {
          return;
        }

        setIsOwnerOnboardingCompleted(true);
        setIsPetOnboardingCompleted(res.pet_profile_completed);
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      }
    };

    void fetchOnboardingStatus();

    return () => {
      isCancelled = true;
    };
  }, [initialized, user, accessToken]);

  return { isOwnerOnboardingCompleted, isPetOnboardingCompleted };
}
