"use client";

import PostComposer from "@/components/feeds/PostComposer";
import { useState } from "react";

export default function FeedPage() {
  const [feedsFilter, setFeedsFilter] = useState("recent");

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
    </div>
  );
}
