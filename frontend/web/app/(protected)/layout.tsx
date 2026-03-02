"use client";

import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { useAuth } from "@/hooks/useAuth";
import useOnboarding from "@/hooks/useOnboarding";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useAuth();
  const { isOwnerOnboardingCompleted, isPetOnboardingCompleted } =
    useOnboarding();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/login");
    } else if (!isOwnerOnboardingCompleted) {
      router.replace("/create-profile/owner");
    } else if (!isPetOnboardingCompleted) {
      router.replace("/create-profile/pet");
    }
  }, [
    user,
    initialized,
    router,
    isOwnerOnboardingCompleted,
    isPetOnboardingCompleted,
  ]);

  if (!initialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname.includes("/create-profile")) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell flex min-h-screen">
      <LeftSidebar />
      <main className="flex-1">{children}</main>
      <RightSidebar />
    </div>
  );
}
