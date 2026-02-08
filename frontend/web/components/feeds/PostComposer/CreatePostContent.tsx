import Image from "next/image";
import { Dialog } from "radix-ui";
import ProfilePlaceholder from "@/assets/images/profile-placeholder.png";
import { Share2 } from "@deemlol/next-icons";

type CreatePostContentProps = {
  openVisibilityDialog: () => void;
};

export default function CreatePostContent({
  openVisibilityDialog,
}: CreatePostContentProps) {
  // TODO: Add emoticons and media upload functionality with the dialog!

  return (
    <>
      <Dialog.Title className="text-xl font-bold mb-6">
        <div
          className="flex rounded-md hover:bg-gray-200 w-fit p-4 items-center gap-4 cursor-pointer"
          onClick={openVisibilityDialog}>
          <Image
            src={ProfilePlaceholder}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full border-2 border-gray-400 shadow-lg"
          />
          <span className="text-xl font-semibold text-gray-500">@username</span>
          <Share2 size={25} className="text-gray-500" />
        </div>
      </Dialog.Title>
      {/* Hidden description for screen readers */}
      <Dialog.Description className="sr-only">
        Create a new post by entering text and selecting visibility options.
      </Dialog.Description>

      <textarea
        className="w-full text-2xl border-none rounded-md mb-4 min-h-[300px] outline-none"
        placeholder="Share your pet adventures..."
      />

      <div className="flex justify-end gap-3">
        <Dialog.Close asChild>
          <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
        </Dialog.Close>
        <button className="px-4 py-2 rounded-md bg-orange-400 text-white hover:bg-orange-500">
          Post
        </button>
      </div>
    </>
  );
}
