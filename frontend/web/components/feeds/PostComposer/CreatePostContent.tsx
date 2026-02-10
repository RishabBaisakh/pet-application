import Image from "next/image";
import { Dialog } from "radix-ui";
import ProfilePlaceholder from "@/assets/images/profile-placeholder.png";
import { Share2, Smile } from "@deemlol/next-icons";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

type CreatePostContentProps = {
  openVisibilityDialog: () => void;
};

export default function CreatePostContent({
  openVisibilityDialog,
}: CreatePostContentProps) {
  // TODO: Move emoji picker state to parent component if we want to use it in other places
  // TODO: Add Media upload and preview functionality

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const insertEmoji = (emojiObject: { emoji: string }) => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    const newValue = text.slice(0, start) + emojiObject.emoji + text.slice(end);
    setText(newValue);

    // Move cursor after emoji
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + emojiObject.emoji.length;
    }, 0);
  };

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
        <div className="relative">
          <button
            className="cursor-pointer rounded-full hover:bg-gray-200 p-2"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}>
            <Smile size={35} />
          </button>

          {emojiPickerOpen && (
            <div
              ref={pickerRef}
              className="absolute bottom-[50px] left-0 z-50 shadow-lg rounded-md">
              <EmojiPicker
                allowExpandReactions
                searchDisabled
                skinTonesDisabled
                lazyLoadEmojis
                previewConfig={{ showPreview: false }}
                onEmojiClick={insertEmoji}
              />
            </div>
          )}
        </div>

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
