"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const publicRoutes = ["/", "/login", "/signup"];

export default function AuthGate({ children }: { children: ReactNode }) {
  const user = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && publicRoutes.includes(pathname)) {
      router.replace("/feeds");
      return;
    }

    if (!user && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    }
  }, [user, pathname, router]);

  // prevent children from rendering while redirecting
  if (
    (user && publicRoutes.includes(pathname)) ||
    (!user && !publicRoutes.includes(pathname))
  ) {
    return null;
  }

  return <>{children}</>;
}
