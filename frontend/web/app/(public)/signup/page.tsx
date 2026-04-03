"use client";

import Link from "next/link";
import { SignupFormValues } from "@/schemas/auth-schema";
import { useAuth } from "@/hooks/useAuth";
import SignupForm from "@/components/forms/SignupForm";

export default function SignupPage() {
  const { register } = useAuth();

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await register(data.email, data.password, data.confirmPassword);
    } catch (err) {
      console.error("Network or server error", err);
      // TODO: Show user-friendly error message on the UI - Form Error
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
        <SignupForm onSubmit={onSubmit} />
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
