"use client";

import { updatePetProfile } from "@/api/profile";
import Loader from "@/components/common/Loader";
import CreatePetProfileForm from "@/components/forms/CreatePetProfileForm";
import { useInitializePetProfile } from "@/hooks/useInitializePetProfile";
import { PetProfileFormValues } from "@/schemas/pet-profile-schema";
import { useRouter } from "next/navigation";

export default function CreatePetProfile() {
  const { petProfileId, ownerProfileId, loading } = useInitializePetProfile();
  const router = useRouter();

  async function onSubmit(data: PetProfileFormValues) {
    const updatedData = await updatePetProfile(petProfileId!, data);
    
    if (!updatedData) {
      // TODO: Handle error case, e.g. show a toast notification
      console.error("Failed to update pet profile");
      return;
    }
    router.push("/feeds");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreatePetProfileForm 
        onSubmit={onSubmit} 
        petProfileId={petProfileId!} 
        ownerProfileId={ownerProfileId!} 
      />
    </div>
  );
}
