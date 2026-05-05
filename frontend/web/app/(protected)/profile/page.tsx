"use client";

import Loader from "@/components/common/Loader";
import EditOwnerProfileForm from "@/components/profile/EditOwnerProfileForm";
import OwnerProfileHeader from "@/components/profile/OwnerProfileHeader";
import PetProfileCard from "@/components/profile/PetProfileCard";
import {
  getOwnerProfile,
  getPetProfiles,
  updateOwnerProfile,
} from "@/api/profile";
import { OwnerProfileFormValues } from "@/schemas/owner-profile-schema";
import { OwnerProfile } from "@/types/models/owner";
import { PetProfile } from "@/types/models/pet";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    Promise.all([getOwnerProfile(), getPetProfiles()])
      .then(([owner, pets]) => {
        setOwnerProfile(owner);
        setPetProfiles(pets);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(data: OwnerProfileFormValues) {
    if (!ownerProfile) return;
    const updated = await updateOwnerProfile(ownerProfile.id, data);
    setOwnerProfile(updated);
    setIsEditing(false);
  }

  if (loading) return <Loader />;

  if (!ownerProfile) {
    return (
      <div className="p-8 text-center text-gray-500">
        Owner profile not found.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <OwnerProfileHeader
        ownerProfile={ownerProfile}
        onEditClick={() => setIsEditing((prev) => !prev)}
      />

      {isEditing && (
        <EditOwnerProfileForm
          ownerProfile={ownerProfile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {petProfiles.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">
            Pets
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({petProfiles.length})
            </span>
          </h2>
          <div className="space-y-3">
            {petProfiles.map((pet) => (
              <PetProfileCard key={pet.id} pet={pet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
