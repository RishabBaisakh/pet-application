"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import AwsS3 from "@uppy/aws-s3";
import UppyDashboard from "@uppy/react/dashboard";

import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";
import "@uppy/image-editor/css/style.css";
import { presignUploadUrl } from "@/api/media";

type UppyMeta = {
  mediaId?: string;
  fileUrl?: string;
};

type Props = {
  ownerProfileId: string;
  petProfileId?: string;
  serviceType: "PROFILE" | "ACCOUNT" | "DOCUMENTS ";
  onUploaded: (url: string, mediaId: string) => void;
};

export default function ImageUploader({
  ownerProfileId,
  petProfileId,
  serviceType,
  onUploaded,
}: Props) {
  console.log("🚀 ~ ImageUploader ~ ownerProfileId:", ownerProfileId);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const uppy = useMemo(() => {
    const u = new Uppy<UppyMeta>({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
        maxFileSize: 5 * 1024 * 1024,
      },
      autoProceed: false,
    });

    u.use(ImageEditor, {
      quality: 0.9,
      cropperOptions: { viewMode: 1, background: false },
    });

    // S3 direct upload via presign API
    u.use(AwsS3, {
      shouldUseMultipart: false,
      async getUploadParameters(file) {
        const data = await presignUploadUrl({
          ownerProfileId: ownerProfileId,
          petProfileId: petProfileId || null,
          serviceType: serviceType,
          filename: file.name,
          contentType: file.type,
        });

        u.setFileMeta(file.id, {
          mediaId: data.mediaId,
          fileUrl: data.fileUrl,
        });

        return {
          method: "PUT",
          url: data.uploadUrl,
          headers: { "Content-Type": file.type },
        };
      },
    });

    u.on("upload-success", (file) => {
      if (!file) {
        return;
      }

      const { mediaId, fileUrl } = file.meta;
      if (typeof fileUrl === "string" && typeof mediaId === "string") {
        onUploaded?.(fileUrl, mediaId);
      }
    });

    return u;
  }, [ownerProfileId, petProfileId, serviceType, onUploaded]);

  // TODO: Cleanup uppy instance on unmount to prevent memory leaks
  // useEffect(() => {
  //   return () => {
  //     uppy.destroy();
  //   };
  // }, [uppy]);

  return (
    <div className="space-y-3">
      <UppyDashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        hideUploadButton
        height={350}
        note="Images only, up to 5MB"
      />
      <button
        type="button"
        onClick={() => void uppy.upload()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {"Upload image"}
      </button>
    </div>
  );
}
