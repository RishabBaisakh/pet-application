import {
  OwnerProfileFormValues,
  ownerProfileSchema,
} from "@/schemas/owner-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Image from "next/image";
import { useForm } from "react-hook-form";
import OwnerPlaceholderImage from "@/assets/images/owner-placeholder.jpg";
import Icon from "../common/Icon";

interface CreateOwnerFormProps {
  onSubmit: (data: OwnerProfileFormValues) => void;
}

export default function CreateOwnerForm({ onSubmit }: CreateOwnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<OwnerProfileFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      bio: "",
      avatar_url: "",
    },
    resolver: zodResolver(ownerProfileSchema),
    mode: "onChange",
  });

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
      <div>
        <input
          type="url"
          {...register("avatar_url")}
          className="w-full border rounded-lg px-3 py-2"
          aria-hidden="true"
          hidden
        />
      </div>
      <div>
        <label className="block font-bold mb-1">First name</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-required="true"
          {...register("first_name")}
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Last name</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("last_name")}
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
