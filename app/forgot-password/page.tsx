"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/new-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link has been sent to your email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="text-indigo-600 text-3xl">🐾</span>
            PetShop<span className="text-indigo-600">Manager</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="mt-1 text-slate-500">Enter your email to receive a reset link</p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}