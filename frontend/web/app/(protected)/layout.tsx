"use client";

import Loader from "@/components/common/Loader";
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
  const { isOnboardingCompleted, loading } = useOnboarding();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initialized || loading) return;

    if (!user) {
      router.replace("/login");
    } else  {
      if (!isOnboardingCompleted) {
        router.replace("/create-profile/owner");
      } else {
        router.replace("/feeds");
      }
    } 
  }, [
    user,
    initialized,
    router,
    isOnboardingCompleted,
    loading
  ]);

  if (!initialized || loading) {
    return <Loader />;
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
