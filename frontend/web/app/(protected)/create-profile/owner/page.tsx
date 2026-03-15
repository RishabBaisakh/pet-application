"use client";

import CreateOwnerForm from "@/components/forms/CreateOwnerForm";
import { useInitializeOwnerProfile } from "@/hooks/useInitializeOwnerProfile";
import { OwnerProfileFormValues } from "@/schemas/owner-profile-schema";
import { useRouter } from "next/navigation";

export default function OwnerProfileFormPage() {
  const router = useRouter();
  const { ownerProfileId, isInitializing } = useInitializeOwnerProfile();

  async function onSubmit(data: OwnerProfileFormValues) {
    console.log("Owner Profile Data:", data);

    router.push("/create-profile/pet");
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loader...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreateOwnerForm onSubmit={onSubmit} />
    </div>
  );
}
