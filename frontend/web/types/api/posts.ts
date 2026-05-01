import { Post } from "../models/post";

export interface PaginatedFeedResponse {
  next: string | null;
  previous: string | null;
  results: Post[];
}
