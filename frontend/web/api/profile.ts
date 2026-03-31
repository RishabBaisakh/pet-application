import {
  UpdateOwnerProfileRequest,
  UpdateOwnerProfileResponse,
} from "@/types/api/profile";
import { createAPI } from "./axiosFactory";

interface ProfileClientRuntime {
  getAccessToken: () => string | null;
  logout: () => Promise<void>;
}

const profileClientRuntime: ProfileClientRuntime = {
  getAccessToken: () => null,
  logout: async () => undefined,
};

export function configureProfileClient(options: Partial<ProfileClientRuntime>) {
  if (options.getAccessToken) {
    profileClientRuntime.getAccessToken = options.getAccessToken;
  }
  if (options.logout) {
    profileClientRuntime.logout = options.logout;
  }
}

export const profileService = createAPI("profile", {
  getAccessToken: () => profileClientRuntime.getAccessToken(),
  logout: () => profileClientRuntime.logout(),
});

export async function getOnboardingStatus() {
  try {
    const res = await profileService.get("/onboarding-status/");
    return res.data; // { owner_profile_completed: boolean, pet_profile_completed: boolean }
  } catch (err: unknown) {
    throw { detail: "Failed to fetch onboarding status", error: err };
  }
}

export async function initializeOwnerProfile() {
  try {
    const res = await profileService.post("/init_owner/");
    return res.data; // owner profile Id
  } catch (err: unknown) {
    throw { detail: "Failed to initialize owner profile", error: err };
  }
}

export async function initializePetProfile() {
  try {
    const res = await profileService.post("/init_pet/");
    return res.data; // pet profile Id
  } catch (err: unknown) {
    throw { detail: "Failed to initialize pet profile", error: err };
  }
}

export async function updateOwnerProfile(
  ownerProfileId: string,
  data: UpdateOwnerProfileRequest,
): Promise<UpdateOwnerProfileResponse> {
  try {
    const res = await profileService.patch(`/owner/${ownerProfileId}/`, data);
    return res.data;
  } catch (err: unknown) {
    throw { detail: "Failed to update owner profile", error: err };
  }
}
