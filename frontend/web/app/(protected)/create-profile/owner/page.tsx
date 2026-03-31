"use client";

import { updateOwnerProfile } from "@/api/profile";
import CreateOwnerForm from "@/components/forms/CreateOwnerForm";
import { useInitializeOwnerProfile } from "@/hooks/useInitializeOwnerProfile";
import { OwnerProfileFormValues } from "@/schemas/owner-profile-schema";
import { useRouter } from "next/navigation";

export default function OwnerProfileFormPage() {
  const router = useRouter();
  const { ownerProfileId, isInitializing } = useInitializeOwnerProfile();

  async function onSubmit(data: OwnerProfileFormValues) {
    const updatedData = await updateOwnerProfile(ownerProfileId!, {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio ?? "",
      avatarUrl: data.avatarUrl ?? "",
    });
    console.log("🚀 ~ onSubmit ~ updatedData:", updatedData);

    if (!updatedData) {
      // TODO: Handle error case, e.g. show a toast notification
      console.error("Failed to update owner profile");
      return;
    }

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
      <CreateOwnerForm onSubmit={onSubmit} ownerProfileId={ownerProfileId!} />
    </div>
  );
}
