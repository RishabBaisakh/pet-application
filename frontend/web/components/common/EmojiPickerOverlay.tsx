import dynamic from "next/dynamic";
import { useState } from "react";
import Icon from "./Icon";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerOverlayProps {
  text: string;
  fieldRef: React.RefObject<HTMLTextAreaElement | null>;
  setText: (value: string) => void;
}

export default function EmojiPickerOverlay({
  text,
  fieldRef,
  setText,
}: EmojiPickerOverlayProps) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const insertEmoji = (emojiObject: { emoji: string }) => {
    if (!fieldRef.current) return;
    const ta = fieldRef.current;
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
    <div className="emoji-picker relative">
      <button
        className="cursor-pointer rounded-full hover:bg-gray-200 p-2"
        onClick={() => setEmojiPickerOpen((prev) => !prev)}>
        <Icon name="FaceIcon" />
      </button>

      {emojiPickerOpen && (
        <div className="absolute bottom-[50px] left-0 z-50 shadow-lg rounded-md">
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
  );
}
