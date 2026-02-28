import Image from "next/image";
import { Dialog } from "radix-ui";
import OwnerPlaceholder from "@/assets/images/owner-placeholder.jpg";
import { Share2 } from "@deemlol/next-icons";
import { useRef, useState } from "react";
import EmojiPickerOverlay from "@/components/common/EmojiPickerOverlay";

interface CreatePostContentProps {
  openVisibilityDialog: () => void;
}

export default function CreatePostContent({
  openVisibilityDialog,
}: CreatePostContentProps) {
  // TODO: Add Media upload and preview functionality

  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      <Dialog.Title className="text-xl font-bold mb-6">
        <div
          className="flex rounded-md hover:bg-gray-200 w-fit p-4 items-center gap-4 cursor-pointer"
          onClick={openVisibilityDialog}>
          <Image
            src={OwnerPlaceholder}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full border-2 border-gray-400 shadow-lg"
          />
          <span className="text-xl font-semibold text-gray-500">@username</span>
          <Share2 size={25} className="text-gray-500" />
        </div>
      </Dialog.Title>

      <Dialog.Description className="sr-only">
        Create a new post by entering text and selecting visibility options.
      </Dialog.Description>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full text-2xl border-none rounded-md mb-4 min-h-[300px] outline-none"
        placeholder="Share your pet adventures..."
      />

      <div className="flex justify-between gap-3 relative">
        <EmojiPickerOverlay
          text={text}
          fieldRef={textareaRef}
          setText={setText}
        />
        <div className="flex gap-2">
          <Dialog.Close asChild>
            <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
          </Dialog.Close>
          <button className="px-4 py-2 rounded-md bg-orange-400 text-white hover:bg-orange-500">
            Post
          </button>
        </div>
      </div>
    </>
  );
}
