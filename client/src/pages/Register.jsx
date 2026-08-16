import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import useAuthStore from "../store/authStore";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must contain at least 2 characters"),

    email: z
      .string()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must contain at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Register() {
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white antialiased flex flex-col justify-between">
      {/* Top Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-slate-800/80 px-6 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            InterviewPro
          </span>
        </Link>

        <Link
          to="/"
          className="text-sm font-medium text-slate-400 hover:text-white transition"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Register Card */}
      <main className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Start practicing for your next interview
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name
              </label>

              <Input
                type="text"
                placeholder="John Doe"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                {...registerField("fullName")}
              />

              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email
              </label>

              <Input
                type="email"
                placeholder="name@company.com"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                {...registerField("email")}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                {...registerField("password")}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                Confirm Password
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                {...registerField("confirmPassword")}
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:underline"
            >
              Login
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} InterviewPro. All rights reserved.
      </footer>
    </div>
  );
}

export default Register;