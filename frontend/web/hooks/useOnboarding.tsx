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

        setIsOwnerOnboardingCompleted(res.owner_profile_completed);
        setIsPetOnboardingCompleted(res.pet_profile_completed);
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      }
    };

    void fetchOnboardingStatus();

    return () => {
      isCancelled = true;
    };
  }, [initialized, user]);

  return { isOwnerOnboardingCompleted, isPetOnboardingCompleted };
}
