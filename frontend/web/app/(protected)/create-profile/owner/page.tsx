"use client";

import CreateOwnerForm from "@/components/forms/CreateOwnerForm";
import { OwnerProfileFormValues } from "@/schemas/owner-profile-schema";
import { useRouter } from "next/navigation";

export default function OwnerProfileFormPage() {
  const router = useRouter();

  async function onSubmit(data: OwnerProfileFormValues) {
    console.log("Owner Profile Data:", data);

    router.push("/create-profile/pet");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreateOwnerForm onSubmit={onSubmit} />
    </div>
  );
}
