"use client";

import Icon from "@/components/common/Icon";
import Loader from "@/components/common/Loader";
import ProgressBar from "@/components/common/ProgressBar";
import { useAuth } from "@/hooks/useAuth";
import useOnboarding from "@/hooks/useOnboarding";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Step {
  key: string;
  label: string;
  pathname: string;
}

const STEPS: Step[] = [
  { key: "owner", label: "Owners Profile", pathname: "/create-profile/owner" },
  { key: "pet", label: "Pet Profile", pathname: "/create-profile/pet" },
];

export default function CreateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const {isOwnerOnboardingCompleted, loading}= useOnboarding();
  
  const currentStep =
    STEPS.find((step) => pathname.includes(step.pathname)) || STEPS[0];
  
  useEffect(() => {
    if (loading) return;

    if (isOwnerOnboardingCompleted) {
      if (pathname === "/create-profile/owner") {
        router.replace("/create-profile/pet");
      }
    } else {
      if (pathname === "/create-profile/pet") {
        router.replace("/create-profile/owner");
      }
    }
  }, [isOwnerOnboardingCompleted, pathname, router, loading]);
  

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="relative flex justify-center gap-6 py-6 bg-white shadow-md rounded-b-lg">
        {STEPS.map((step) => (
          <div
            key={step.key}
            className={`text-lg font-semibold ${
              step.key === currentStep.key ? "text-blue-500" : "text-gray-400"
            }`}>
            {step.label}
          </div>
        ))}
        <button
          onClick={() => logout()}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <Icon name="ExitIcon" />
        </button>
      </div>
      <ProgressBar
        step={STEPS.indexOf(currentStep)}
        totalSteps={STEPS.length}
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
