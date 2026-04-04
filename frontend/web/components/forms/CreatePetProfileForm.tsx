"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PetProfileFormValues,
  petProfileSchema,
} from "@/schemas/pet-profile-schema";
import Image from "next/image";
import Icon from "../common/Icon";
import PetPlaceholderImage from "@/assets/images/pet-placeholder.png";
import { PET_TYPES } from "@/constants/pet";
import { CANADA_PROVINCES } from "@/constants/location";
import ImageUploader from "../common/ImageUploader";

interface PetProfileFormProps {
  petProfileId: string;
  ownerProfileId: string;
  onSubmit: (data: PetProfileFormValues) => void;
}

export default function CreatePetProfileForm({ petProfileId, ownerProfileId, onSubmit }: PetProfileFormProps) {
  console.log("🚀 ~ CreatePetProfileForm ~ ownerProfileId:", ownerProfileId)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<PetProfileFormValues>({
    resolver: zodResolver(petProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "Dog",
      breed: undefined,
      age: undefined,
      bio: undefined,
      avatarUrl: undefined,
      city: undefined,
      province: undefined,
    },
  });

  const avatarUrl = watch("avatarUrl");

  const onImageUpload = (mediaUrl: string, mediaId: string) => {
    setValue("avatarUrl", mediaUrl, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-4 space-y-4">
      <div>
        <div className="relative w-fit h-fit mx-auto">
          <Image
            src={avatarUrl || PetPlaceholderImage}
            alt="Profile Logo"
            width={128}
            height={128}
            className="mb-4 mx-auto rounded-full border-3 border-gray-300 shadow-lg"
            priority
          />
          <span className="absolute border-2 border-white bg-gray-200 rounded-full p-1 right-3 top-0 transform translate-x-1/2 translate-y-1/2 cursor-pointer hover:bg-gray-300">
            <Icon name="PlusIcon" size={24} color="gray" />
          </span>
        </div>
      </div>
      <ImageUploader
        serviceType="PROFILE"
        onUploaded={onImageUpload}
        ownerProfileId={ownerProfileId}
        petProfileId={petProfileId}
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
        <label className="block font-bold mb-1">Breed</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("breed")}
        />
      </div>
      
      <div>
        <label className="block font-bold mb-1">Age</label>
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
            (optional - max 1000 characters)
          </span>
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("bio")}
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

      <div>
        <label className="block font-bold mb-1">City</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("city")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
        {isSubmitting ? "Saving..." : "Save Pet Profile"}
      </button>
    </form>
  );
}
