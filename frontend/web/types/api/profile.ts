import { OwnerProfile } from "../models/owner";
import { PetProfile } from "../models/pet";

export type UpdateOwnerProfileRequest = Omit<OwnerProfile, "id">;

export type UpdateOwnerProfileResponse = OwnerProfile;

export interface InitOwnerProfileResponse {
  id: string;
  status: string;
}

export interface InitPetProfileResponse {
  id: string;
  ownerProfileId: string;
  status: string;
}

export interface OnboardingStatusResponse {
  ownerProfileCompleted: boolean;
  petProfileCompleted: boolean;
}

export type UpdatePetProfileRequest = Omit<PetProfile, "id" | "ownerProfileId">;

export type UpdatePetProfileResponse = PetProfile;
