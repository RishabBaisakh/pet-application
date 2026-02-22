"use client";

import CreatePetForm from "@/components/forms/CreatePetForm";
import { PetProfileFormValues } from "@/schemas/pet-profile-schema";

export default function CreatePetProfile() {
  async function onSubmit(data: PetProfileFormValues) {
    console.log("Pet Profile Data:", data);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreatePetForm onSubmit={onSubmit} />
    </div>
  );
}
