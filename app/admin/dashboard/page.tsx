"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData || !["admin", "staff"].includes(profileData.role)) {
        router.push("/");
        return;
      }

      setProfile(profileData);

      // Fetch stats
      const { count: totalPets } = await supabase
        .from("pets")
        .select("*", { count: "exact", head: true });

      const { count: availablePets } = await supabase
        .from("pets")
        .select("*", { count: "exact", head: true })
        .eq("status", "available");

      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalPets: totalPets || 0,
        availablePets: availablePets || 0,
        totalProducts: totalProducts || 0,
        totalUsers: totalUsers || 0,
      });

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="text-indigo-600 text-2xl">🐾</span>
              PetShop<span className="text-indigo-600">Admin</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {profile?.full_name} ({profile?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Total Pets</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalPets}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Available Pets</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.availablePets}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Products</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Admin Menu */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Management</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/products" className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold">Product Management</h3>
            <p className="text-sm text-slate-500 mt-1">Add, edit, delete products</p>
          </Link>

          <Link href="/admin/pets" className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
            <div className="text-2xl mb-2">🐕</div>
            <h3 className="font-semibold">Pet Management</h3>
            <p className="text-sm text-slate-500 mt-1">Manage all pets</p>
          </Link>

          <Link href="/admin/users" className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-slate-500 mt-1">View and manage users</p>
          </Link>

          <Link href="/admin/reports" className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold">Reports & Analytics</h3>
            <p className="text-sm text-slate-500 mt-1">Sales and performance reports</p>
          </Link>

          <Link href="/messages" className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold">Message Board</h3>
            <p className="text-sm text-slate-500 mt-1">View customer messages</p>
          </Link>

          <Link href="/admin/transactions" className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold">Transactions</h3>
            <p className="text-sm text-slate-500 mt-1">All purchase records</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
