"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string;
  contact_number: string;
  address: string;
  gender: string;
  role: string;
};

const emptyProfile: Profile = {
  full_name: "",
  contact_number: "",
  address: "",
  gender: "",
  role: "customer",
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");
      const { data: savedProfile } = await supabase
        .from("profiles")
        .select("full_name, contact_number, address, gender, role")
        .eq("id", user.id)
        .maybeSingle();

      const metadata = user.user_metadata;
      setProfile({
        full_name: savedProfile?.full_name ?? metadata.full_name ?? "",
        contact_number: savedProfile?.contact_number ?? metadata.contact_number ?? "",
        address: savedProfile?.address ?? metadata.address ?? "",
        gender: savedProfile?.gender ?? metadata.gender ?? "",
        role: savedProfile?.role ?? metadata.role ?? "customer",
      });
      setLoading(false);
    };

    loadProfile();
  }, [router, supabase]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Your session has expired. Please log in again.");
      setSaving(false);
      return;
    }

    const editableProfile = {
      full_name: profile.full_name.trim(),
      contact_number: profile.contact_number.trim(),
      address: profile.address.trim(),
      gender: profile.gender,
    };

    const { error: authError } = await supabase.auth.updateUser({
      data: editableProfile,
    });

    if (authError) {
      setError(authError.message);
      setSaving(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...editableProfile }, { onConflict: "id" });

    if (profileError) {
      setError(`Your account was updated, but the profile record could not be saved: ${profileError.message}`);
      setSaving(false);
      return;
    }

    setProfile((current) => ({ ...current, ...editableProfile }));
    setMessage("Profile updated successfully.");
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading profile...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            <span className="text-indigo-600">PetShop</span> Manager
          </Link>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">Back to Home</Link>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-slate-500">Manage your account information.</p>

          {error && <p className="mt-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          {message && <p className="mt-5 rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">{message}</p>}

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input id="email" value={email} readOnly className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-500" />
            </div>
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <input id="fullName" required value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="contactNumber" className="mb-1.5 block text-sm font-medium text-slate-700">Contact Number</label>
              <input id="contactNumber" required type="tel" value={profile.contact_number} onChange={(event) => setProfile({ ...profile, contact_number: event.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
              <textarea id="address" required rows={3} value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} className="w-full resize-y rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label>
              <select id="gender" required value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500">
                <option value="" disabled>Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
              <input value={profile.role} readOnly className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 capitalize text-slate-500" />
            </div>
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
