import {
  OwnerProfileFormValues,
  ownerProfileSchema,
} from "@/schemas/owner-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import OwnerPlaceholderImage from "@/assets/images/owner-placeholder.jpg";
import Icon from "../common/Icon";
import ImageUploader from "../common/ImageUploader";

interface CreateOwnerFormProps {
  ownerProfileId: number;
  onSubmit: (data: OwnerProfileFormValues) => void;
}

export default function CreateOwnerForm({
  ownerProfileId,
  onSubmit,
}: CreateOwnerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<OwnerProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      avatarUrl: "",
    },
    resolver: zodResolver(ownerProfileSchema),
    mode: "onChange",
  });

  const avatarUrl = useWatch({
    control,
    name: "avatarUrl",
  });
  console.log("🚀 ~ CreateOwnerForm ~ avatarUrl:", avatarUrl);

  function onImageUpload(mediaUrl: string, mediaId: string) {
    console.log("🚀 ~ onImageUpload ~ mediaUrl:", mediaUrl);
    console.log("🚀 ~ onImageUpload ~ mediaId:", mediaId);

    setValue("avatarUrl", mediaUrl, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="relative w-fit h-fit mx-auto">
          <Image
            src={OwnerPlaceholderImage}
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
        serviceType="profile"
        onUploaded={onImageUpload}
        ownerProfileId={ownerProfileId?.toString()}
      />
      {/* <div>
        <input
          type="url"
          {...register("avatarUrl")}
          className="w-full border rounded-lg px-3 py-2"
          aria-hidden="true"
          hidden
        />
      </div> */}
      <div>
        <label className="block font-bold mb-1">First name</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-required="true"
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
            (optional - max 1000 characters)
          </span>
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("bio")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={clsx(
          "bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50",
          {
            "cursor-pointer": !(isSubmitting || !isValid),
          },
        )}>
        {isSubmitting ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
