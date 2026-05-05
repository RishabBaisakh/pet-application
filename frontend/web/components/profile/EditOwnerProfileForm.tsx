import {
  OwnerProfileFormValues,
  ownerProfileSchema,
} from "@/schemas/owner-profile-schema";
import { OwnerProfile } from "@/types/models/owner";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import OwnerPlaceholderImage from "@/assets/images/owner-placeholder.jpg";
import Icon from "../common/Icon";
import ImageUploader from "../common/ImageUploader";

interface EditOwnerProfileFormProps {
  ownerProfile: OwnerProfile;
  onSave: (updated: OwnerProfileFormValues) => void;
  onCancel: () => void;
}

export default function EditOwnerProfileForm({
  ownerProfile,
  onSave,
  onCancel,
}: EditOwnerProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<OwnerProfileFormValues>({
    defaultValues: {
      firstName: ownerProfile.firstName,
      lastName: ownerProfile.lastName,
      bio: ownerProfile.bio ?? "",
      avatarUrl: ownerProfile.avatarUrl ?? "",
    },
    resolver: zodResolver(ownerProfileSchema),
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
      <h2 className="text-lg font-bold">Edit Profile</h2>

      <div>
        <div className="relative w-fit h-fit mx-auto">
          <Image
            src={avatarUrl || OwnerPlaceholderImage}
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
        ownerProfileId={ownerProfile.id}
        open={uploaderOpen}
        onRequestClose={() => setUploaderOpen(false)}
      />

      <div>
        <label className="block font-bold mb-1">First name</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("firstName")}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Last name</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("lastName")}
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
