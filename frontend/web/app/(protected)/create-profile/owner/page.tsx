"use client";

import { updateOwnerProfile } from "@/api/profile";
import Loader from "@/components/common/Loader";
import CreateOwnerProfileForm from "@/components/forms/CreateOwnerProfileForm";
import { useInitializeOwnerProfile } from "@/hooks/useInitializeOwnerProfile";
import { OwnerProfileFormValues } from "@/schemas/owner-profile-schema";
import { useRouter } from "next/navigation";

export default function OwnerProfileFormPage() {
  const router = useRouter();
  const { ownerProfileId, loading } = useInitializeOwnerProfile();

  async function onSubmit(data: OwnerProfileFormValues) {
    const updatedData = await updateOwnerProfile(ownerProfileId!, data);
    if (!updatedData) {
      // TODO: Handle error case, e.g. show a toast notification
      console.error("Failed to update owner profile");
      return;
    }
    router.push("/create-profile/pet");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreateOwnerProfileForm onSubmit={onSubmit} ownerProfileId={ownerProfileId!} />
    </div>
  );
}
