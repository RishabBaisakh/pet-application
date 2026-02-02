"use client";

import { useState } from "react";
import Link from "next/link";
import { signupSchema } from "@/schemas/auth.schema";
import { ZodError } from "zod";
import { register } from "@/api/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateField = (
    field: "email" | "password" | "confirmPassword",
    value: string,
  ) => {
    try {
      if (field === "email") {
        signupSchema.shape.email.parse(value);
      } else if (field === "password") {
        signupSchema.shape.password.parse(value);
      } else if (field === "confirmPassword") {
        // Confirm password needs access to password value for cross-check
        if (value !== password) throw new Error("Passwords do not match");
        signupSchema.shape.confirmPassword.parse(value); // optional if you want extra rules
      }

      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.issues[0].message }));
      } else if (err instanceof Error) {
        setErrors((prev) => ({ ...prev, [field]: err.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);

    // Optional: validate all fields before submit
    validateField("email", email);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);

    if (errors.email || errors.password || errors.confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      const data = await register({ email, password, confirmPassword });
      console.log("User registered:", data);

      // optionally redirect or show a success message
    } catch (err) {
      console.error("Network or server error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-900">
          Create an Account
        </h1>
        <p className="mb-6 text-center text-blue-900">
          Join the Community and Start Sharing the Pawsome Moments!
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
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
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validateField("confirmPassword", confirmPassword)}
              required
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer font-bold bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 disabled:opacity-50">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
      <div className="mt-8">
        <span className="text-blue-800">
          Already a member?{" "}
          <Link
            className="py-2 px-4 font-bold hover:underline hover:bg-blue-200 rounded-full"
            href="/login">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
}
