import { createAPI } from "./axiosFactory";

interface MediaClientRuntime {
  getAccessToken: () => string | null;
  logout: () => Promise<void>;
}

const mediaClientRuntime: MediaClientRuntime = {
  getAccessToken: () => null,
  logout: async () => undefined,
};

export function configureMediaClient(options: Partial<MediaClientRuntime>) {
  if (options.getAccessToken) {
    mediaClientRuntime.getAccessToken = options.getAccessToken;
  }
  if (options.logout) {
    mediaClientRuntime.logout = options.logout;
  }
}

export const mediaService = createAPI("media", {
  getAccessToken: () => mediaClientRuntime.getAccessToken(),
  logout: () => mediaClientRuntime.logout(),
});

interface PresignUploadData {
  ownerProfileId: number;
  petProfileId: number | null;
  serviceType: string;
  filename: string;
  contentType: string;
}

export async function presignUploadUrl(data: PresignUploadData) {
  try {
    const res = await mediaService.post("/presign/", data);
    return res.data; // { upload_url: string, file_url: string }
  } catch (err: unknown) {
    throw { detail: "Failed to get presigned upload URL", error: err };
  }
}

export async function confirmUpload(mediaId: string) {
  try {
    const res = await mediaService.post(`/${mediaId}/confirm/`);
    return res.data; // { success: boolean }
  } catch (err: unknown) {
    throw { detail: "Failed to confirm upload", error: err };
  }
}
