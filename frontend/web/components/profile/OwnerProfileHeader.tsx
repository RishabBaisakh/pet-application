import Image from "next/image";
import OwnerPlaceholderImage from "@/assets/images/owner-placeholder.jpg";
import { OwnerProfile } from "@/types/models/owner";

interface OwnerProfileHeaderProps {
  ownerProfile: OwnerProfile;
  onEditClick: () => void;
}

export default function OwnerProfileHeader({
  ownerProfile,
  onEditClick,
}: OwnerProfileHeaderProps) {
  const { firstName, lastName, bio, avatarUrl, status } = ownerProfile;

  return (
    <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
      <Image
        src={avatarUrl || OwnerPlaceholderImage}
        alt="Owner avatar"
        width={128}
        height={128}
        className="w-32 h-32 object-cover rounded-4xl border-2 border-gray-300 shadow-md"
        priority
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {firstName} {lastName}
        </h1>

        <span
          className={
            "inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold " +
            (status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700")
          }>
          {status === "ACTIVE" ? "Active" : "Onboarding"}
        </span>

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
