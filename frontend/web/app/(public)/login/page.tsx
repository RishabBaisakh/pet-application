"use client";

import Link from "next/link";
import { LoginFormValues } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const loginState = await login(data.email, data.password);
      if (
        !loginState.profileStatusUnknown &&
        loginState.ownerProfileCompleted &&
        loginState.petProfileCompleted
      ) {
        router.replace("/feeds");
      } else if (!loginState.ownerProfileCompleted) {
        router.replace("/create-profile/owner");
      } else {
        router.replace("/create-profile/pet");
      }
    } catch (err) {
      console.error("Login failed:", err);
      // TODO: Show user-friendly error message on the UI - Form Error
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
        <LoginForm onSubmit={onSubmit} />
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
