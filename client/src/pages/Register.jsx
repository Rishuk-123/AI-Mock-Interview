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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-slate-500">
            Start practicing for your next interview
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Full Name
            </label>

            <Input
              type="text"
              placeholder="Enter your full name"
              {...registerField("fullName")}
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Email
            </label>

            <Input
              type="email"
              placeholder="Enter your email"
              {...registerField("email")}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Password
            </label>

            <Input
              type="password"
              placeholder="Create a password"
              {...registerField("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <Input
              type="password"
              placeholder="Confirm your password"
              {...registerField("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </div>

      </Card>
    </div>
  );
}

export default Register;