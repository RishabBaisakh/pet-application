export interface PostMedia {
  id: string;
  mediaFileId: string;
  order: number;
}

export interface Post {
  id: string;
  ownerProfileId: string;
  petProfileId: string | null;
  content: string;
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE";
  status: "ACTIVE" | "DELETED";
  media: PostMedia[];
  createdAt: string;
  updatedAt: string;
}
