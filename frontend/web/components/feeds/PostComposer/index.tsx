"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import OwnerPlaceholder from "@/assets/images/owner-placeholder.jpg";
import { useState } from "react";
import PostActions from "./PostActions";
import CreatePostContent from "./CreatePostContent";
import VisibilityFilterContent from "./VisibilityFilterContent";

export default function PostComposer() {
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setVisibilityDialogOpen(false);
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
              />
            ) : (
              <CreatePostContent
                openVisibilityDialog={() => setVisibilityDialogOpen(true)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
