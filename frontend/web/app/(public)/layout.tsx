"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && user) {
      if (
        !user.profileStatusUnknown &&
        user.ownerProfileCompleted &&
        user.petProfileCompleted
      ) {
        router.replace("/feeds");
      } else if (user.profileStatusUnknown || !user.ownerProfileCompleted) {
        router.replace("/create-profile/owner");
      } else {
        router.replace("/create-profile/pet");
      }
    }
  }, [user, initialized, router]);

  return <>{children}</>;
}
