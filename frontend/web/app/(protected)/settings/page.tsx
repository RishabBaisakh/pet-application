"use client";

import Loader from "@/components/common/Loader";
import { me } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/models/user";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        Failed to load account information.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
        <SettingsRow label="Email" value={user.email} />

        <SettingsRow
          label="Role"
          value={
            user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
          }
        />

        <SettingsRow
          label="Verified"
          value={
            <span
              className={
                "px-3 py-0.5 rounded-full text-xs font-semibold " +
                (user.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700")
              }>
              {user.isVerified ? "Verified" : "Not verified"}
            </span>
          }
        />

        <SettingsRow
          label="Member since"
          value={new Date(user.createdAt).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => logout()}
          className="px-5 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-95 transition-transform">
          Log out
        </button>
      </div>
    </div>
  );
}

function SettingsRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}
