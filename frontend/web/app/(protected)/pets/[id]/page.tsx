"use client";

import Loader from "@/components/common/Loader";
import EditPetProfileForm from "@/components/profile/EditPetProfileForm";
import PetProfileHeader from "@/components/profile/PetProfileHeader";
import { getPetProfile, updatePetProfile } from "@/api/profile";
import { PetProfileFormValues } from "@/schemas/pet-profile-schema";
import { PetProfile } from "@/types/models/pet";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PetProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getPetProfile(id)
      .then(setPetProfile)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(data: PetProfileFormValues) {
    if (!petProfile) return;
    const updated = await updatePetProfile(petProfile.id, data);
    setPetProfile(updated);
    setIsEditing(false);
  }

  if (loading) return <Loader />;

  if (!petProfile) {
    return <div className="p-8 text-center text-gray-500">Pet not found.</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <PetProfileHeader
        petProfile={petProfile}
        onEditClick={() => setIsEditing((prev) => !prev)}
      />

      {isEditing && (
        <EditPetProfileForm
          petProfile={petProfile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
