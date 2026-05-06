"use client";

import {
  PetProfileFormValues,
  petProfileSchema,
} from "@/schemas/pet-profile-schema";
import { PetProfile } from "@/types/models/pet";
import { PET_TYPES } from "@/constants/pet";
import { CANADA_PROVINCES } from "@/constants/location";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import PetPlaceholderImage from "@/assets/images/pet-placeholder.png";
import Icon from "../common/Icon";
import ImageUploader from "../common/ImageUploader";

interface EditPetProfileFormProps {
  petProfile: PetProfile;
  onSave: (updated: PetProfileFormValues) => void;
  onCancel: () => void;
}

export default function EditPetProfileForm({
  petProfile,
  onSave,
  onCancel,
}: EditPetProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<PetProfileFormValues>({
    defaultValues: {
      name: petProfile.name ?? "",
      type: petProfile.type ?? "",
      breed: petProfile.breed ?? "",
      age: petProfile.age,
      bio: petProfile.bio ?? "",
      city: petProfile.city ?? "",
      province: petProfile.province ?? "",
      avatarUrl: petProfile.avatarUrl ?? "",
    },
    resolver: zodResolver(petProfileSchema),
    mode: "onChange",
  });

  const [uploaderOpen, setUploaderOpen] = useState(false);
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  function onImageUpload(mediaUrl: string) {
    setValue("avatarUrl", mediaUrl, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setUploaderOpen(false);
  }

  return (
    <form
      className="space-y-4 border border-gray-200 rounded-xl p-6"
      onSubmit={handleSubmit(onSave)}>
      <h2 className="text-lg font-bold">Edit Pet Profile</h2>

      <div>
        <div className="relative w-fit h-fit mx-auto">
          <Image
            src={avatarUrl || PetPlaceholderImage}
            alt="Avatar preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-4xl border-2 border-gray-300 shadow-md"
          />
          <span
            onClick={() => setUploaderOpen((prev) => !prev)}
            className="absolute border-2 border-white bg-gray-200 rounded-full p-1 right-3 top-0 transform translate-x-1/2 translate-y-1/2 cursor-pointer hover:bg-gray-300">
            <Icon name="PlusIcon" size={20} color="gray" />
          </span>
        </div>
      </div>

      <ImageUploader
        serviceType="PROFILE"
        onUploaded={onImageUpload}
        ownerProfileId={petProfile.ownerProfileId}
        petProfileId={petProfile.id}
        open={uploaderOpen}
        onRequestClose={() => setUploaderOpen(false)}
      />

      <div>
        <label className="block font-bold mb-1">Name</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("name")}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Pet Type</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("type")}>
          <option value="">Select pet type</option>
          {PET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-bold mb-1">
          Breed <span className="text-gray-500 font-medium">(optional)</span>
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("breed")}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">
          Age <span className="text-gray-500 font-medium">(optional)</span>
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("age", { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">
          Bio{" "}
          <span className="text-gray-500 font-medium">
            (optional — max 1000 characters)
          </span>
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("bio")}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">City</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("city")}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Province</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("province")}>
          <option value="">Select province</option>
          {CANADA_PROVINCES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={clsx(
            "bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50 font-semibold",
            { "cursor-pointer": !(isSubmitting || !isValid) },
          )}>
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-transform">
          Cancel
        </button>
      </div>
    </form>
  );
}
