import { Post } from "../models/post";

export interface PaginatedFeedResponse {
  next: string | null;
  previous: string | null;
  results: Post[];
}

export interface CreatePostPayload {
  content: string;
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE";
  mediaFileIds?: string[];
}
