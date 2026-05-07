"use client";

import { useCallback, useEffect, useState } from "react";
import { getFeed } from "@/api/posts";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/models/post";

export default function useFeed() {
  const { initialized, user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    let isCancelled = false;

    const fetchInitialFeed = async () => {
      setIsLoading(true);
      try {
        const data = await getFeed();
        if (isCancelled) return;
        setPosts(data.results);
        setNextCursor(data.next ? extractCursor(data.next) : null);
      } catch (err) {
        console.error("Failed to fetch feed", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void fetchInitialFeed();

    return () => {
      isCancelled = true;
    };
  }, [initialized, user]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const data = await getFeed(nextCursor);
      setPosts((prev) => [...prev, ...data.results]);
      setNextCursor(data.next ? extractCursor(data.next) : null);
    } catch (err) {
      console.error("Failed to load more posts", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore]);

  const prependPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  return {
    posts,
    isLoading,
    isLoadingMore,
    hasMore: nextCursor !== null,
    loadMore,
    prependPost,
  };
}

/** Extract the `cursor` query param value from a full next/previous URL. */
function extractCursor(url: string): string | null {
  try {
    const cursor = new URL(url).searchParams.get("cursor");
    return cursor;
  } catch {
    return null;
  }
}
