"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { authAPI } from "@/lib/api";

const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be exactly 5 digits"),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export default function TutorRegister() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", zipCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message; });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await authAPI.register({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, zipCode: formData.zipCode, password: formData.password, role: "TUTOR" });
      localStorage.setItem("pendingEmail", formData.email);
      localStorage.setItem("tutorId", JSON.stringify(result.data.id));
      window.location.href = "/auth/check-email";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#1a237e]">Join as Tutor</h1>
          <p className="text-gray-600 mt-2 text-sm">Share your knowledge and earn money</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass("firstName")} />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass("lastName")} />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className={inputClass("password")} />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className={inputClass("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass("email")} />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
                <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} maxLength={5} className={inputClass("zipCode")} />
                {errors.zipCode && <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#1a237e] text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors font-semibold disabled:opacity-50 text-sm">
              {loading ? "Creating Account..." : "Create Tutor Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">Already have an account?{" "}
              <Link href="/auth/login" className="text-[#1a237e] hover:text-blue-900 font-medium">Sign in</Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-xs">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
