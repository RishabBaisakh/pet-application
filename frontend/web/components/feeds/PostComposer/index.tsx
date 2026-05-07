"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import OwnerPlaceholder from "@/assets/images/owner-placeholder.jpg";
import { useState } from "react";
import PostActions from "./PostActions";
import CreatePostContent from "./CreatePostContent";
import VisibilityFilterContent, {
  VisibilityOption,
} from "./VisibilityFilterContent";
import { createPost } from "@/api/posts";
import { Post } from "@/types/models/post";

const VISIBILITY_MAP: Record<VisibilityOption, Post["visibility"]> = {
  public: "PUBLIC",
  friends: "FRIENDS",
  onlyMe: "PRIVATE",
};

interface PostComposerProps {
  onPostCreated?: (post: Post) => void;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [text, setText] = useState("");
  const [visibilityOption, setVisibilityOption] =
    useState<VisibilityOption>("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setVisibilityDialogOpen(false);
      setText("");
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const post = await createPost({
        content: text.trim(),
        visibility: VISIBILITY_MAP[visibilityOption],
      });
      onPostCreated?.(post);
      setDialogOpen(false);
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-composer bg-orange-50 p-4 rounded-xl mb-6">
      <Dialog.Root open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <Dialog.Trigger asChild>
          <div>
            <div className="flex items-center rounded-full bg-white cursor-pointer shadow-md hover:bg-gray-100">
              <Image
                src={OwnerPlaceholder}
                alt="Post Placeholder"
                width={60}
                height={60}
                className="rounded-full m-2"
              />
              <p className="ml-2 text-gray-500">Share something!</p>
            </div>
            <PostActions />
          </div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-full max-w-[800px]">
            {visibilityDialogOpen ? (
              <VisibilityFilterContent
                closeVisibilityDialog={() => setVisibilityDialogOpen(false)}
                selected={visibilityOption}
                onSelect={setVisibilityOption}
              />
            ) : (
              <CreatePostContent
                openVisibilityDialog={() => setVisibilityDialogOpen(true)}
                text={text}
                setText={setText}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {error && (
              <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
