"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckEmail() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("pendingEmail") }),
      });
      setResent(true);
    } catch (err) {
      console.error("Failed to resend:", err);
    } finally {
      setResending(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Click the link to verify your account and start your onboarding.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-3">
            <strong>Didn't receive the email?</strong><br />
            Check your spam folder or wait a few minutes.
          </p>
          {!resent ? (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
            >
              {/* need to put 5 mns countdown before user can click resend email */}
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          ) : (
            <p className="text-sm font-semibold text-green-600">✓ Email sent!</p>
          )}
        </div>

        <Link
          href="/auth/login"
          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
