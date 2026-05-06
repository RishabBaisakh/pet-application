import Image from "next/image";
import PetPlaceholderImage from "@/assets/images/pet-placeholder.png";
import { PetProfile } from "@/types/models/pet";
import { PET_TYPES } from "@/constants/pet";

interface PetProfileHeaderProps {
  petProfile: PetProfile;
  onEditClick: () => void;
}

const GENDER_LABELS: Record<string, string> = {
  M: "Male",
  F: "Female",
  O: "Other",
};

function getPetTypeLabel(value: string): string {
  return PET_TYPES.find((t) => t.value === value)?.label ?? value;
}

function formatLocation(city?: string, province?: string): string | null {
  if (city && province) return `${city}, ${province}`;
  if (city) return city;
  if (province) return province;
  return null;
}

export default function PetProfileHeader({
  petProfile,
  onEditClick,
}: PetProfileHeaderProps) {
  const {
    name,
    type,
    breed,
    age,
    bio,
    gender,
    avatarUrl,
    city,
    province,
    status,
    isPrivate,
  } = petProfile;

  const location = formatLocation(city, province);

  return (
    <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
      <Image
        src={avatarUrl || PetPlaceholderImage}
        alt={name || "Pet"}
        width={128}
        height={128}
        className="w-32 h-32 object-cover rounded-4xl border-2 border-gray-300 shadow-md"
        priority
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold">{name || "Unnamed Pet"}</h1>

        <div className="flex justify-center flex-wrap gap-2 mt-1">
          <span
            className={
              "px-3 py-0.5 rounded-full text-xs font-semibold " +
              (status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700")
            }>
            {status === "ACTIVE" ? "Active" : "Onboarding"}
          </span>

          {isPrivate && (
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              Private
            </span>
          )}
        </div>

        <div className="flex justify-center flex-wrap gap-x-3 gap-y-0.5 mt-2 text-sm text-gray-500">
          {type && <span>{getPetTypeLabel(type)}</span>}
          {breed && <span>· {breed}</span>}
          {age != null && (
            <span>
              · {age} yr{age !== 1 ? "s" : ""}
            </span>
          )}
          {gender && gender !== "O" && (
            <span>· {GENDER_LABELS[gender] ?? gender}</span>
          )}
          {location && <span>· {location}</span>}
        </div>

        {bio && (
          <p className="mt-3 text-gray-600 max-w-md text-sm leading-relaxed">
            {bio}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onEditClick}
        className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-transform">
        Edit Profile
      </button>
    </div>
  );
}
