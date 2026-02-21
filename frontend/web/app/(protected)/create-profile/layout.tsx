"use client";

import ProgressBar from "@/components/common/ProgressBar";
import { usePathname } from "next/navigation";

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

  const currentStep =
    STEPS.find((step) => pathname.includes(step.pathname)) || STEPS[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-center gap-6 py-6 bg-white shadow-md rounded-b-lg">
        {STEPS.map((step) => (
          <div
            key={step.key}
            className={`text-lg font-semibold ${
              step.key === currentStep.key ? "text-blue-500" : "text-gray-400"
            }`}>
            {step.label}
          </div>
        ))}
      </div>
      <ProgressBar
        step={STEPS.indexOf(currentStep) + 1}
        totalSteps={STEPS.length}
      />
      <div className="flex-1">
        <>{children}</>
      </div>
    </div>
  );
}
