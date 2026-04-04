export interface PetProfile {
  id: string;
  ownerProfileId: string;
  name: string;
  type: string;
  age?: number;
  breed?: string;
  bio?: string;
  avatarUrl?: string;
  province?: string;
  city?: string;
}