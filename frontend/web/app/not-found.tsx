"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-orange-400 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Oops! This pet ran away.
      </h2>

      <p className="text-gray-500 mb-6 max-w-md">
        The page you are looking for doesn’t exist or has wandered off. Don’t
        worry – we’ll help you find your way back!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/feeds"
          className="px-6 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 transition">
          Go to Feed
        </Link>
        <Link
          href="/profile"
          className="px-6 py-3 bg-white text-orange-400 border border-orange-400 font-semibold rounded-lg shadow-md hover:bg-orange-50 transition">
          Your Profile
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 bg-white text-orange-400 border border-orange-400 font-semibold rounded-lg shadow-md hover:bg-orange-50 transition">
          Explore Pets
        </Link>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <input
          type="text"
          placeholder="Search for friends or posts..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
      </div>
    </div>
  );
}
