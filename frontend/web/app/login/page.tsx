"use client";

import { useState } from "react";
import Link from "next/link";
import { loginSchema } from "@/schemas/auth.schema";
import { ZodError } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { login } = useAuth();
  const router = useRouter();

  const validateField = (field: "email" | "password", value: string) => {
    try {
      if (field === "email") {
        loginSchema.shape.email.parse(value);
      } else if (field === "password") {
        loginSchema.shape.password.parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.issues[0].message }));
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    validateField("email", email);
    validateField("password", password);

    if (errors.email || errors.password) {
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      router.push("/feeds");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl text-blue-900 mb-2 font-bold text-center">
          Welcome to Pet Application
        </h1>
        <p className="mb-6 text-center text-blue-900">
          Connect and Share the Pawsome Moments!
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField("email", email)}
              required
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validateField("password", password)}
              required
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          <div className="text-right mb-4">
            <span className="text-blue-800">
              <Link
                className="py-2 px-4 font-bold hover:underline hover:bg-blue-200 rounded-full"
                href="/forgot-password">
                Forgot Password?
              </Link>
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer font-bold bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950 disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <div className="mt-8">
        <span className="text-blue-800">
          New to Pet Application?{" "}
          <Link
            className="py-2 px-4 font-bold hover:underline hover:bg-blue-200 rounded-full"
            href="/signup">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
}
