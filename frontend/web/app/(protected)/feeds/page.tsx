"use client";

import PostComposer from "@/components/feeds/PostComposer";
import useFeed from "@/hooks/useFeed";
import { useState } from "react";

export default function FeedPage() {
  const [feedsFilter, setFeedsFilter] = useState("recent");
  const { posts, isLoading, isLoadingMore, hasMore, loadMore } = useFeed();

  const handleFeedsFilterChange = (filter: string) => {
    setFeedsFilter(filter);
  };

  return (
    <div className="feed-page p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Feeds</h1>
        <div>
          <span
            onClick={() => handleFeedsFilterChange("recent")}
            className={
              "mx-3 font-bold cursor-pointer " +
              (feedsFilter === "recent" ? "text-black-500" : "text-gray-400 ")
            }>
            Recent
          </span>
          <span
            onClick={() => handleFeedsFilterChange("friends")}
            className={
              "mx-3 font-bold cursor-pointer " +
              (feedsFilter === "friends" ? "text-black-500" : "text-gray-400 ")
            }>
            Friends
          </span>
          <span
            onClick={() => handleFeedsFilterChange("popular")}
            className={
              "mx-3 font-bold cursor-pointer " +
              (feedsFilter === "popular" ? "text-black-500" : "text-gray-400 ")
            }>
            Popular
          </span>
        </div>
      </div>

      <PostComposer />

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-gray-400 text-center">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-center">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>
              {post.content && <p className="text-gray-800">{post.content}</p>}
            </div>
          ))
        )}

        {hasMore && (
          <div className="flex justify-center pt-2">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium disabled:opacity-50">
              {isLoadingMore ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
