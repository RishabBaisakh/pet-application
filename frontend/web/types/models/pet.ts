export interface PetProfile {
  id: string;
  ownerProfileId: string;
  name: string;
  type: string;
  age?: number;
  breed?: string;
  bio?: string;
  gender?: string;
  avatarUrl?: string;
  city?: string;
  province?: string;
  country?: string;
  isPrivate?: boolean;
}
