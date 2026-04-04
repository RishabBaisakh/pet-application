export interface UpdateOwnerProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateOwnerProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
}
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
  owner_profile_completed: boolean;
  pet_profile_completed: boolean;
}

export interface UpdatePetProfileRequest {
  name: string;
  type: string;
  age?: number;
  breed?: string;
  bio?: string;
  avatarUrl?: string;
  province?: string;
  city?: string;
}

export interface UpdatePetProfileResponse {
  id: string;
  name: string;
  type: string;
  age?: number;
  breed?: string;
  bio?: string;
  avatarUrl?: string;
  province?: string;
  city?: string;
}