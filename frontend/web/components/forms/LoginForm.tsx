import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/schemas/auth.schema";
import Link from "next/link";

type LoginFormProps = {
  onSubmit: (data: LoginFormValues) => void;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="text"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="user-email"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>
      <div>
        <input
          type="password"
          required
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
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
        disabled={isSubmitting}
        className="w-full cursor-pointer font-bold bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950 disabled:opacity-50">
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
