"use client";

import { useEffect, useMemo, useRef } from "react";
import Uppy from "@uppy/core";
import ImageEditor from "@uppy/image-editor";
import AwsS3 from "@uppy/aws-s3";
import Dashboard from "@uppy/dashboard";

import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";
import "@uppy/image-editor/css/style.css";

type UppyMeta = {
  mediaId?: string;
  fileUrl?: string;
};

type Props = {
  // ownerId: string;
  petId?: string;
  serviceType: "profile" | "account" | "documents";
  onUploaded?: (url: string, mediaId: string) => void;
};

export default function ImageUploader({
  // ownerId,
  petId,
  serviceType,
  onUploaded,
}: Props) {
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
        const res = await fetch("/api/media/presign-upload/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // owner_id: ownerId,
            pet_id: petId,
            service_type: serviceType,
            filename: file.name,
            content_type: file.type,
          }),
        });

        const data = await res.json();

        u.setFileMeta(file.id, {
          mediaId: data.media_id,
          fileUrl: data.file_url,
        });

        return {
          method: "PUT",
          url: data.upload_url,
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
  }, [petId, serviceType, onUploaded]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    uppy.use(Dashboard, {
      inline: true,
      target: containerRef.current,
      proudlyDisplayPoweredByUppy: false,
      height: 350,
      note: "Images only, up to 5MB",
    });

    return () => {
      uppy.destroy();
    };
  }, [uppy]);

  return <div ref={containerRef} />;
}
