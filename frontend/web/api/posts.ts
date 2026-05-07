import { createAPI } from "./axiosFactory";
import { CreatePostPayload, PaginatedFeedResponse } from "../types/api/posts";
import { Post } from "../types/models/post";

interface PostsClientRuntime {
  getAccessToken: () => string | null;
  logout: () => Promise<void>;
}

const postsClientRuntime: PostsClientRuntime = {
  getAccessToken: () => null,
  logout: async () => undefined,
};

export function configurePostsClient(options: Partial<PostsClientRuntime>) {
  if (options.getAccessToken) {
    postsClientRuntime.getAccessToken = options.getAccessToken;
  }
  if (options.logout) {
    postsClientRuntime.logout = options.logout;
  }
}

export const postsService = createAPI("posts", {
  getAccessToken: () => postsClientRuntime.getAccessToken(),
  logout: () => postsClientRuntime.logout(),
});

export async function getFeed(cursor?: string): Promise<PaginatedFeedResponse> {
  const params = cursor ? { cursor } : {};
  const res = await postsService.get("/feed/", { params });
  return res.data;
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const res = await postsService.post("/", payload);
  return res.data;
}
