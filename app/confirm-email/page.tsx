"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/shop");
    router.refresh();
  };

  const handleResend = async () => {
    if (!email) {
      setError("Enter the email address you used to register.");
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resend({ type: "signup", email });

    if (error) {
      setError(error.message);
    } else {
      setMessage("A new confirmation code has been sent.");
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="text-indigo-600 text-3xl">🐾</span>
            PetShop<span className="text-indigo-600">Manager</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Confirm your email</h1>
          <p className="mt-1 text-slate-500">Enter the verification code sent to your email.</p>
        </div>

        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={8}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-center tracking-[0.4em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="12345678"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-60">
            {loading ? "Confirming..." : "Confirm Email"}
          </button>
        </form>

        <button type="button" onClick={handleResend} disabled={resending} className="w-full mt-4 text-sm text-indigo-600 font-semibold hover:underline disabled:opacity-60">
          {resending ? "Sending a new code..." : "Resend code"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
