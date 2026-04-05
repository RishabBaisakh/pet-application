"use client";

import { useMemo, useRef } from "react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import AwsS3 from "@uppy/aws-s3";

import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";
import "@uppy/image-editor/css/style.css";
import { presignUploadUrl } from "@/api/media";
import DashboardModal from "@uppy/react/dashboard-modal";

type UppyMeta = {
  mediaId?: string;
  fileUrl?: string;
};

type Props = {
  ownerProfileId: string;
  petProfileId?: string;
  serviceType: "PROFILE" | "ACCOUNT" | "DOCUMENTS ";
  open: boolean;
  onRequestClose: () => void;
  onUploaded: (url: string, mediaId: string) => void;
};

export default function ImageUploader({
  ownerProfileId,
  petProfileId,
  serviceType,
  open,
  onRequestClose,
  onUploaded,
}: Props) {
  const onUploadedRef = useRef(onUploaded);
  onUploadedRef.current = onUploaded;

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
        onUploadedRef.current?.(fileUrl, mediaId);
      }
    });

    return u;
  }, [ownerProfileId, petProfileId, serviceType]);

  return (
    <DashboardModal
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      open={open}
      note="Images only, up to 5MB"
      onRequestClose={onRequestClose}
    />
  );
}
