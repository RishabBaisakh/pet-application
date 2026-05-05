import Image from "next/image";
import PetPlaceholderImage from "@/assets/images/pet-placeholder.png";
import { PetProfile } from "@/types/models/pet";
import { PET_TYPES } from "@/constants/pet";

interface PetProfileCardProps {
  pet: PetProfile;
}

function getPetTypeLabel(value: string): string {
  return PET_TYPES.find((t) => t.value === value)?.label ?? value;
}

function formatLocation(city?: string, province?: string): string | null {
  if (city && province) return `${city}, ${province}`;
  if (city) return city;
  if (province) return province;
  return null;
}

export default function PetProfileCard({ pet }: PetProfileCardProps) {
  const { name, type, breed, age, bio, avatarUrl, city, province, status } =
    pet;

  const location = formatLocation(city, province);

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <Image
        src={avatarUrl || PetPlaceholderImage}
        alt={name || "Pet"}
        width={72}
        height={72}
        className="w-18 h-18 object-cover rounded-xl border border-gray-200 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-lg leading-tight">
            {name || "Unnamed Pet"}
          </h3>

          <span
            className={
              "px-2 py-0.5 rounded-full text-xs font-semibold " +
              (status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700")
            }>
            {status === "ACTIVE" ? "Active" : "Onboarding"}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-sm text-gray-500">
          {type && <span>{getPetTypeLabel(type)}</span>}
          {breed && <span>· {breed}</span>}
          {age != null && (
            <span>
              · {age} yr{age !== 1 ? "s" : ""}
            </span>
          )}
          {location && <span>· {location}</span>}
        </div>

        {bio && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{bio}</p>
        )}
      </div>
    </div>
  );
}
