import * as Dialog from "@radix-ui/react-dialog";
import { Globe, Lock, Users } from "@deemlol/next-icons";
import { JSX, useState } from "react";
import clsx from "clsx";

type VisibilityOption = "public" | "friends" | "onlyMe";

interface VisibilityFilterContentProps {
  closeVisibilityDialog: () => void;
}

export default function VisibilityFilterContent({
  closeVisibilityDialog,
}: VisibilityFilterContentProps) {
  const [selected, setSelected] = useState<VisibilityOption>("public");

  const options: {
    label: string;
    value: VisibilityOption;
    icon: JSX.Element;
  }[] = [
    { label: "Public", value: "public", icon: <Globe size={20} /> },
    { label: "Friends", value: "friends", icon: <Users size={20} /> },
    { label: "Only Me", value: "onlyMe", icon: <Lock size={20} /> },
  ];

  return (
    <>
      <Dialog.Title className="text-xl font-bold mb-2">
        Who can see your post?
      </Dialog.Title>
      {/* Hidden description for screen readers */}
      <Dialog.Description className="sr-only">
        Select who can view your post.
      </Dialog.Description>

      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelected(option.value)}
            className={clsx(
              "flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200",
              selected === option.value &&
                "bg-orange-100 border border-orange-400",
            )}>
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeVisibilityDialog}
            className="px-4 py-2 rounded-md bg-orange-400 text-white hover:bg-orange-500">
            Back
          </button>
        </div>
      </div>
    </>
  );
}
