export interface UpdateOwnerProfileRequest {
  firstName: string;
  lastName: string;
  bio: string | "";
  avatarUrl: string | "";
}

export interface UpdateOwnerProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | "";
  avatarUrl: string | "";
}
